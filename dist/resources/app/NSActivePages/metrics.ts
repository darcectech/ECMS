/**
 * Created by darylcecile on 08/06/2017.
 */

use.page = {
    main:function(){

        this.fetchSiteloadData('webex.com',function(data:Array<any>){

            let datasetA = {};
            let datasetB = {
                "Jan":0,
                "Feb":0,
                "Mar":0,
                "Apr":0,
                "May":0,
                "Jun":0,
                "Jul":0,
                "Aug":0,
                "Sep":0,
                "Oct":0,
                "Nov":0,
                "Dec":0
            };

            /*
             locale = "en-gb";
             d = new Date(Date.parse('2017-06-11 19:00:39'))
             month = d.toLocaleString(locale, { month: "short" });
             */

            data.forEach(function(rec){
                if (datasetA[ rec['PageID'] ] !== undefined){

                    if (Array.isArray(datasetA[ rec['PageID'] ])){
                        datasetA[ rec['PageID'] ].push( Number.parseInt(rec['LoadSpeedMS']) )
                    }
                    else if (typeof datasetA[ rec['PageID'] ] === "string"){

                        let v = datasetA[ rec['PageID'] ];

                        datasetA[ rec['PageID'] ] = [ Number.parseInt(v) , Number.parseInt(rec['LoadSpeedMS']) ];

                    }
                    else if (typeof datasetA[ rec['PageID'] ] === "number"){

                        let v = datasetA[ rec['PageID'] ];

                        datasetA[ rec['PageID'] ] = [ v , rec['LoadSpeedMS'] ];

                    }

                }
                else{
                    datasetA[ rec['PageID'] ] = Number.parseInt(rec['LoadSpeedMS']);
                }

                let locale = "en-gb";
                let d = new Date(Date.parse(rec['LastActivity']));
                let month = d.toLocaleString(locale, { month: "short" });
                datasetB[month] += 1;
            });

            // calcAverages

            Object.keys(datasetA).forEach(function(k){

                if (Array.isArray(datasetA[k]) === true){
                    let sum = datasetA[k].reduce(function(a, b) { return Number.parseInt(a) + Number.parseInt(b); });
                    let avg = sum / datasetA[k].length;
                    datasetA[k] = avg;
                }

            });

            console.log(datasetA,data);
            console.log(datasetB,data);

            pages.metrics.buildChartA(datasetA);
            pages.metrics.buildChartB(datasetB);

        });

    },
    fetchSiteloadData:function(siteRef:string,cb){
        let request = require("request");

        let options = { method: 'GET',
            url: `http://darylcecile.net/slimApp/public/index.php/api/performance/${siteRef}` };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            let r = /[^]+?(\[[^]+?])/g.exec(body);

            cb(JSON.parse(r[1]));
        });
    },
    buildChartA:function(datavalues:any){
        let data = {
            labels: Object.keys(datavalues),
            datasets: [{
                label: "Pageload Average",
                backgroundColor: "rgba(0, 188, 212,0.2)",
                borderColor: "rgba(0, 188, 212,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(0, 188, 212,0.4)",
                hoverBorderColor: "rgba(0, 188, 212,1)",
                data: Object.values(datavalues),
            }]
        };

        let options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: true,
                        color: "rgba(0, 188, 212,0.2)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        };

        global['Chart'].Bar('chartA', {
            options: options,
            data: data
        });
    },
    buildChartB:function(datavalues:any){
        let data = {
            labels: Object.keys(datavalues),
            datasets: [{
                label: "Total User Engagement",
                backgroundColor: "rgba(255, 20, 147,0.2)",
                borderColor: "rgba(255, 20, 147,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255, 20, 147,0.4)",
                hoverBorderColor: "rgba(255, 20, 147,1)",
                data: Object.values(datavalues),
            }]
        };

        let options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: true,
                        color: "rgba(255, 20, 147,0.2)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        };

        global['Chart'].Line('chartB', {
            options: options,
            data: data
        });
    }
};