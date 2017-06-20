/**
 * Created by darylcecile on 08/06/2017.
 */

use.page = {
    main:function(){

        this.fetchSiteloadData('3dpthings.com',function(data:Array<any>){

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

            let sessionCount = {};

            /*
             locale = "en-gb";
             d = new Date(Date.parse('2017-06-11 19:00:39'))
             month = d.toLocaleString(locale, { month: "short" });
             */

            data.forEach(function(rec){
                if (rec['PageID'].indexOf('?') > -1) rec['PageID'] = rec['PageID'].split('?')[0];

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

                if (sessionCount[ rec['SessionUID'] ]){
                    sessionCount[ rec['SessionUID'] ] += 1;
                }
                else{
                    sessionCount[ rec['SessionUID'] ] = 1;
                }

            });

            let uniqueSessions = Object.keys(sessionCount).length;
            let repeatSessions = 0;

            Object.keys(sessionCount).forEach(function (sesh) {

                repeatSessions += sessionCount[sesh]

            });

            repeatSessions = repeatSessions - uniqueSessions;

            let datasetC = {
                "UniqueSessions":uniqueSessions,
                "RepeatSessions":repeatSessions
            };

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
            console.log(datasetC,sessionCount);

            pages.metrics.buildChartA(datasetA);
            pages.metrics.buildChartB(datasetB);
            pages.metrics.buildChartC(datasetC);

        });

    },
    fetchSiteloadData:function(siteRef:string,cb){
        let request = require("request");

        let options = { method: 'GET',
            url: `http://darylcecile.net/slimApp/public/index.php?siteRef=${siteRef}` };

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
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return value + 'ms';
                        }
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
                    },
                    ticks:{
                        stepSize: 2
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
    },
    buildChartC:function(datavalues:any){
        let data = {
            labels: Object.keys(datavalues),
            datasets: [{
                label: "Sessions",
                backgroundColor: ["rgba(232, 255, 0, 0.2)","rgba(0, 255, 10, 0.2)"],
                borderColor: ["rgba(232, 255, 0, 1)","rgba(0, 255, 10, 1)"],
                borderWidth: 2,
                hoverBackgroundColor: ["rgba(232, 255, 0, 0.4)","rgba(0, 255, 10, 0.4)"],
                hoverBorderColor: ["rgba(232, 255, 0, 1)","rgba(0, 255, 10, 1)"],
                data: Object.values(datavalues),
            }]
        };

        let options = {
            maintainAspectRatio: false

        };

        global['Chart'].Doughnut('chartC', {
            options: options,
            data: data
        });
    }
};