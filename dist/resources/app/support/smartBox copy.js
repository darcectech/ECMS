

'use strict';
class SmartBox{
    constructor(element){
        this.element = element;
        this.element.lockedArea = {
            start:0,
            end:0
        };
        this.lastCommand = "";

        let _this = this;
        this.cancelNext = false;
        this.element.addEventListener('keydown',function(e){
            if (e.code === "Escape" || e.key === "Escape"){
                toggleCommand();
            }
            if (_this._private_CheckLocked(_this)){
                console.log('CHECKING');

                if (e.code === "Backspace" || e.key === "Backspace" || e.code === "Delete" || e.key === "Delete"){
                    e.preventDefault();
                    e.cancelBubble = true;
                    _this.cancelNext = true;
                    return false;
                }
                else if (e.code.indexOf('Arrow') > -1){
                    return true;
                }
                else{
                    e.preventDefault();
                    e.cancelBubble = true;
                    _this.cancelNext = true;
                    return false;
                }
            }
            else if (e.code.indexOf('ArrowUp') > -1){
                if (_this.lastCommand !== ""){
                    _this.element.value += _this.lastCommand;
                }
                e.preventDefault();
                e.cancelBubble = true;
                _this.cancelNext = true;
                return false;
            }
            else if (e.code === "Enter" || e.key === "Enter"){
                _this.element.setLockedArea(0, _this.element.selection.end );
                let l = _this.element.lines[_this.element.position.lineNumber-1];
                _this.filterCommand(l,_this);
            }
            else if (e.code === "Backspace" || e.key === "Backspace"){
                if (_this.element.selection.end - 1 === _this.element.lockedArea.end){
                    e.preventDefault();
                    e.cancelBubble = true;
                    _this.cancelNext = true;
                    return false;
                }
            }
        });

        this.element.addEventListener('keypress',function(e){
            if (_this.cancelNext === true){
                e.preventDefault();
                e.cancelBubble = true;
                _this.cancelNext = false;
            }
        });

        this.element.disabled = this.disabled;

        this.element.__defineGetter__('lines',() => {
            return _this.element.value.split('\n');
        });
        this.element.__defineGetter__('position',() => {
            return {
                get lineNumber(){
                   return _this.workoutLines().lineNumber;
                },
                get colNumber(){
                    return _this.workoutLines().column;
                }
            };
        });
        this.element.__defineGetter__('selection',() => {
            return {
                start: _this.element.selectionStart,
                end: _this.element.selectionEnd
            }
        });
        this.element.val = function(v){
            if (v){
                this.value = v;
            }
            else {
                return this.value;
            }
        };

        this.element.setLockedArea = function(start,end){
            _this.element.lockedArea = {
                start,
                end
            };
            console.info('LOCKED AREA ',start,end);
        }
    }

    workoutLines(){

        let charpos = this.element.selectionEnd;
        let charCount = 0;
        let charColumn = 0;
        let line = 0;

        let forceComplete = false;

        this.element.lines.forEach(function(cline){
            if (forceComplete === true) return;
            line ++;
            charColumn = 0;
            for (let cp = 0; cp < cline.length; cp++){
                charColumn++;
                charCount++;
                if ( charCount >= charpos ) {
                    forceComplete=true;
                    break;
                }
            }
        });

        return {
            lineNumber : line,
            column : charColumn - 1
        }

    }

    get disabled(){
        return false;
    }

    get text() {
        return this.element.value;
    }

    _private_CheckLocked(_this=this){

        //if returns true, lock and dont input, else do
        if (_this.element.selection.end > _this.element.lockedArea.start && _this.element.selection.end < _this.element.lockedArea.end){
            return true
        }
        else{

            return _this.element.selection.start > _this.element.lockedArea.start && _this.element.selection.start < _this.element.lockedArea.end;

        }

    }

    filterCommand(text,_this=this){

        let l = text;
        l = l.split('\n').join('');


        if (l.indexOf('return') !== 0) l = 'return '+l;

        if (l .indexOf('return this.clear()') > -1){
            _this.element.value = "";
            _this.element.setLockedArea(0,0);
        }
        else if (l.indexOf('return -help close') > -1){
            _this.element.value = "Help: Press [esc] on your keyboard to close!\n";
            _this.element.setLockedArea(0,44);
        }
        else if (l === 'return clear'){
            _this.element.value = "Hint: Did you mean 'this.clear()' ?\n";
            _this.element.setLockedArea(0,35);
        }
        else if (l === 'return version' || l === 'return vers' || l === 'return -version'){
            _this.element.value += "\n Version 2.0:Beta +\n";
        }
        else{
            if (l === 'return ') l = 'return "Nothing to Run"';
            console.log(l);
            let valex = "";
            try{
                valex = (new Function(l))();
            }
            catch (xx){
                valex = 'bad'
            }
            _this.element.value += "\n = " +  ( valex || "good");
        }
        _this.lastCommand = l.split('return ')[1];
    }
}