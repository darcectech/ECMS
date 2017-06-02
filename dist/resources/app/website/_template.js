
window._template_cache = {};

function _template(template_name,obj){

    if (obj === undefined) return new TemplateEngine(template_name);
    else {
        let template = new TemplateEngine(template_name);

        if (obj['place'] !== undefined){
            template.place(
                obj.place['parentSelector'] ,
                obj.place['templateSelector'] ,
                (obj.place['direct'] || false) ,
                obj.place['projectName']
            );
        }
        if (obj['events'] !== undefined){

            let eventNames = Object.keys(obj.events);
            eventNames.forEach(function(name){
                template.when(name, obj.events[name] );
            });
        }

        return template;

    }

}

class TemplateEngine {

    constructor(template_name){
        this.templateSource = "templates/"+template_name+".html";
        this.content = "";
        this._taskWaiting = [];
        this.target = undefined;
        this.object = {};
        this.events = {};
        this.templateNameX = template_name;
        let _this = this;
        this.ready = false;
        this.runTasks = function(){
            let f = _this.taskWaiting;
            while (f !== undefined){
                f();
                f = _this.taskWaiting;
            }
        };
        this.doneTask = function(){};
    }

    createClone(template_name){
        let b;
        if (template_name) b = new TemplateEngine(template_name);
        else b = this;
        return Object.assign(Object.create(b), b);
    }

    get loaded(){
        return (this.content !== "" && this.ready === true);
    }

    set taskWaiting(f){
        this._taskWaiting.push(f);
    }

    get taskWaiting(){
        let f = this._taskWaiting[0];
        delete this._taskWaiting[0];
        return f;
    }

    get $target(){
        return this.target;
    }

    when(eventName,fnc,remove=false){

        if (this.events[eventName] !== undefined){
            $(this.$target).off(eventName, this.events[eventName]);
        }

        if (remove===true) return this;


        let _this = this;

        if (this.loaded === true){

            this.events[eventName] = function(){
                fnc(_this.$target);
            };

            $(this.$target).on(eventName,this.events[eventName]);
        }
        else{
            this.taskWaiting = function(){

                _this.events[eventName] = function(){
                    fnc(_this.$target);
                };

                $(_this.$target).on(eventName,_this.events[eventName]);
            }
        }
        return this;

    }

    insert(element,selector){

        if (typeof element === "string"){
            element = $(element)[0];
        }

        if (typeof selector === "string"){
            selector = " " + selector;
        }
        else{
            selector = "";
        }

        this.target = $(element);

        this.target.load(this.templateSource + selector);

        return this;

    }

    place(parent_element,selector,direct=false,bindWith){

        if (typeof parent_element === "string"){
            parent_element = $(parent_element)[0];
        }

        if (typeof selector === "string"){
            selector = " " + selector;
        }
        else{
            selector = "";
        }

        if (typeof direct === "string"){
            bindWith = direct;
            direct = false;
        }


        let _this = this;
        let s = $('<div/>').load(this.templateSource + selector,function(){

            _this.content = s.html();

            if (selector !== "" && direct === true) {
                _this.target = s.find(selector);
                _this.target.unwrap();
            }

            if (bindWith !== undefined) _this._bindData(bindWith);

        }).appendTo(parent_element);

        return this;

    }

    _bindData(dataJsonFileName){
        let _path = 'projects/'+dataJsonFileName;
        if (_path.indexOf('.') === -1 || _path.substr(_path.lastIndexOf('.')).toLowerCase() !== ".json"){
            _path += '.json';
        }
        let _this = this;
        console.log('binding with ',dataJsonFileName);
        $.getJSON(_path,function(r){
            _this.object = r;

            window._template_cache[dataJsonFileName] = r;

            function implantData(target){


                let repeats = $(target).find('[_template_repeat]');

                repeats.each(function(i,e){
                    let att = $(e).attr('_template_repeat');
                    if ( att.indexOf('{{') > -1 ){
                        att = att.split('{{')[1].split('}}')[0];
                        if (att.indexOf('[') > -1){
                            att = r[att.split('[')[0]][att.split('[')[1].split(']')[0]];
                        }
                        else {
                            att = r[att];
                        }
                    }

                    $(e).removeAttr('_template_repeat');

                    let template = e.outerHTML;

                    for (let v = 1; v < att; v++){

                        let templateClone = template;
                        templateClone = templateClone.replace('}}','['+v+']}}');

                        $(e).after(templateClone);
                    }

                    template = template.replace('}}','[0]}}');

                    let newThis = $(template);

                    $(e).replaceWith(newThis);

                });


                const regex = /{{(.+?)}}/gmi;
                let str = target[0].outerHTML;
                let m;

                window.r = r;

                let rx;

                function getNr(){
                    rx = regex.exec(str);
                    return rx;
                }

                while ((m = getNr()) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    m.forEach((match, groupIndex) => {

                        if (groupIndex === 1){

                            function replaceAll(_search,_replacement,_text){
                                return _text.replace(new RegExp(_search, 'gmi'), _replacement);
                            }

                            if (typeof match === "boolean") match = match.toString();

                            if (match.indexOf('[') > -1){

                                let word = match.split('[')[0];
                                let index = match.split('[')[1].split(']')[0];
                                let prefixIfIsImage = (word === "images" ? 'images/' : '');

                                function processResourceURL(prefix,url){

                                    if ( url.indexOf('http') === 0 ){
                                        return url;
                                    }
                                    else{
                                        return prefix + url;
                                    }

                                }
                                str = replaceAll('{{'+word+'\\['+index+'\\]}}',processResourceURL(prefixIfIsImage,r[word][index]),str);

                            }
                            else{

                                str = replaceAll('{{'+match+'}}',r[match],str);

                            }


                        }
                    });
                }

                let newTarget = $(str);
                target.replaceWith(newTarget);

                target = newTarget;

                return target;

            }

            _this.target = implantData(implantData(implantData(_this.target)));
            _this.done();

        });

        return this;
    }
    done(fnc){
        if (fnc !== undefined){
            this.doneTask = fnc;
            return;
        }
        this.ready = true;
        this.doneTask(this.object);
        this.runTasks();
    }
}
