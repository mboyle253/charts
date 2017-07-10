Ext.define('Charts.viewcontroller.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewcontroller',

    onPreview: function () {
        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');
            return;
        }
        var chart = this.lookup('chart');
        chart.preview();
    },

    onDataRender: function (v) {
        return v + '%';
    },

    afterrenderpriorities : function(chart){
        var d = chart.getAnimation().duration;
        // Need to delay the same amount of time as
        // the animation duration
        Ext.defer(function(){
            var surface = chart.getSurface(),
                rect = surface.getRect(),
                series = chart.getSeries()[0],
                center = series.getCenter();
            var fontSize = Math.floor(series.getRadius() * .25);
            var sprite = surface.add({
                type: 'text',
                text: this.getViewModel().get('prioritiesTotal'),
                textAlign : 'center',
                fontSize : fontSize + 'px',
                width : '100%',
                x: (center[0] + series.getOffsetX()),
                y: (center[1] + series.getOffsetY() + (fontSize/2))
            });

            sprite.show(true);
        }, d, this);

    },
    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('name') + ': ' + record.get('value') );
    },
    onD3Render : function(v){
        var me = this;

        me.chart = c3.generate({
            bindto : '#Melissa2',
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type : 'donut',
                //onclick: function (d, i) { console.log("onclick", d, i); },
                //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: "45%"
            }
        });

        setTimeout(function () {
            me.chart.load({
                columns: [
                    ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                    ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                    ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                ]
            });
        }, 1500);

        setTimeout(function () {
            me.chart.unload({
                ids: 'data1'
            });
            me.chart.unload({
                ids: 'data2'
            });
        }, 2500);
    },
    onD3Resize : function(){
        //this.chart.flush();
    },
    onChartJsAfterlayout : function(v) {
        v.chart.canvas.parentNode.style.padding = '20px';
    },
    onChartJsRender : function(v){
        var chartColors = {
            red: '#D55554',
            yellow: '#DCB404',
            green: '#3F9F3F',
            blue: '#007599'
        };

        var store = this.getStore('priorities');

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: store.collect('value'),
                    backgroundColor: [
                        chartColors.red,
                        chartColors.yellow,
                        chartColors.green,
                        chartColors.blue
                    ],
                    label: 'Dataset 1'
                }],
                labels: store.collect('legendName')
            },
            options: {
                responsive: true,
                maintainAspectRatio : false,
                legend: {
                    position: 'top',
                    onClick : function(e, item){
                        console.log(item);
                    },
                    labels : {
                        boxWidth : 10
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                elements: {
                    center: {
                        text: store.sum('value'),
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 50 //Default 20 (as a percentage)
                    }
                }

            }
        };

        Chart.pluginService.register({
            beforeDraw: function (chart) {
                if (chart.config.options.elements.center) {
                    //Get ctx from string
                    var ctx = chart.chart.ctx;

                    //Get options from the center object in options
                    var centerConfig = chart.config.options.elements.center;
                    var fontStyle = centerConfig.fontStyle || 'Arial';
                    var txt = centerConfig.text;
                    var color = centerConfig.color || '#000';
                    var sidePadding = centerConfig.sidePadding || 20;
                    var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
                    //Start with a base font of 30px
                    ctx.font = "30px " + fontStyle;

                    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    var stringWidth = ctx.measureText(txt).width;
                    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    var widthRatio = elementWidth / stringWidth;
                    var newFontSize = Math.floor(30 * widthRatio);
                    var elementHeight = (chart.innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    var fontSizeToUse = Math.min(newFontSize, elementHeight);

                    //Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse+"px " + fontStyle;
                    ctx.fillStyle = color;

                    //Draw text in center
                    ctx.fillText(txt, centerX, centerY);
                }
            }
        });

        var ctx = document.getElementById("Melissa1").getContext("2d");
        v.chart = new Chart(ctx, config);
    },
    onHorizontalBarChart : function(v){
        var chartColors = [
            '#D55554',
            '#DCB404',
            '#3F9F3F',
            '#007599'
        ];
        var store = this.getStore('priorities');
        var horizontalBarChartData = {
            labels: store.collect('name'),
            datasets: [{
                label: 'Count',
                backgroundColor: chartColors,
                borderColor: chartColors,
                borderWidth: 1,
                data: store.collect('value')
            }]

        };
        var ctx = document.getElementById("hBarChart").getContext("2d");
        v.chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarChartData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2
                    }
                },
                responsive: true,
                maintainAspectRatio : false,
                legend: {
                    position: 'bottom',
                    labels : {
                        boxWidth : 0
                    }
                },
                title: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    },

    onPlotChart : function(v){
        var store = this.getStore('priorities');

        var options = {
            maintainAspectRatio: false,
            spanGaps: false,
            elements: {
                line: {
                    tension: 0.000001
                }
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0
                    }
                }],
                yAxes : [
                    {
                        ticks : {
                            beginAtZero: true,
                            max : 250,
                            stepSize : 50
                        }
                    }
                ]
            },
            title : {
                display : false
            },
            legend : {
                display : false
            }
        };

        var ctx = document.getElementById("plotChart").getContext("2d");

        v.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: store.collect('name'),
                datasets: [{
                    data: store.collect('value'),
                    fill: false,
                    backgroundColor: '#95AE0C',
                    borderColor: '#576708'
                }]
            },
            options: options
        });

    }

});