/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Charts.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',
    layout : 'border',
    requires : [
        'Ext.chart.series.Pie',
        'Charts.view.main.Pie2',
        'Charts.view.main.ClickSpriteLegend',
        'Ext.chart.interactions.ItemHighlight'
    ],
    controller : 'mainviewcontroller',
    viewModel : {
        stores : {
            priorities :  {
                fields: ['name', 'value', {
                    name : 'legendName', calculate : function(data){
                        return data.name + ' - ' + data.value
                    }
                } ],
                data: [
                    { name : 'P1', value : 20},
                    { name : 'P2', value : 70},
                    { name : 'P3', value : 90},
                    { name : 'P4', value : 30}
                ]
            }
        },
        formulas : {
            prioritiesTotal : function(get){
                var store = get('priorities');
                return store.sum('value');
            }
        }
    },
    initComponent : function(){

        var plotChartConfig = {
            flex : 1,
            frame : true,
            xtype: 'cartesian',
            interactions: {
                type: 'panzoom',
                zoomOnPanGesture: true
            },
            animation: {
                duration: 200
            },
            bind : {
                store : '{priorities}'
            },
            insetPadding: 40,
            innerPadding: {
                left: 40,
                right: 40
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                grid: true,
                minimum: 0,
                maximum: 250
                //renderer: 'onAxisLabelRender'
            }, {
                type: 'category',
                position: 'bottom',
                grid: true,
                label: {
                    rotate: {
                        degrees: -90
                    }
                }
            }],
            series: [{
                type: 'line',
                xField: 'name',
                yField: 'value',
                style: {
                    lineWidth: 2
                },
                marker: {
                    radius: 4,
                    lineWidth: 2
                },
                label: {
                    field: 'value',
                    display: 'over'
                },
                highlight: {
                    fillStyle: '#000',
                    radius: 5,
                    lineWidth: 2,
                    strokeStyle: '#fff'
                }
                //,tooltip: {
                //    trackMouse: true,
                //    showDelay: 0,
                //    dismissDelay: 0,
                //    hideDelay: 0,
                //    renderer: 'onSeriesTooltipRender'
                //}
            }]
            //,listeners: {
            //    itemhighlightchange: 'onItemHighlightChange'
            //}
        }

        var barChartHConfig =
        {
            xtype: 'cartesian',
            flex : 1,
            frame : true,
            reference: 'chart',
            insetPadding: 40,
            flipXY: true,
            animation: {
                easing: 'easeOut',
                duration: 500
            },
            bind : {
                store : '{priorities}'
            },
            axes: [{
                type: 'numeric',
                position: 'bottom',
                fields: 'value',
                grid: true,
                //maximum: 300,
                majorTickSteps: 9,
                title: 'Count'
            }, {
                type: 'category',
                position: 'left',
                fields: 'name',
                grid: true
            }],
            series: [{
                type: 'bar',
                xField: 'name',
                yField: 'value',
                style: {
                    opacity: 0.80,
                    minGapWidth: 10
                },
                highlightCfg: {
                    strokeStyle: 'black',
                    radius: 10
                },
                renderer:  function (sprite, config, rendererData, index)
                {
                    var item = rendererData.store.getData().items[index];
                    var color = '#D55554';
                    switch (item.get('name')){
                        case 'P2' : color = '#DCB404'; break;
                        case 'P3' : color = '#3F9F3F'; break;
                        case 'P4' : color = '#007599'; break;
                    }
                        return { fillStyle: color };
                }
            }]
        };

        var piechartConfig =
        {
            xtype: 'polar',
            flex : 1,
            frame : true,
            reference: 'chart',
            bind : {
                store : '{priorities}'
            },
            legend: {
                type : 'clicksprite',
                toggleable : false,
                docked: 'top'
            },
            colors : ['#D55554', '#DCB404', '#3F9F3F', '#007599'],
            series: [{
                type: 'pie2',
                angleField: 'value',
                donut: 45,
                radiusFactor : 90,
                label: {
                    field: 'legendName',
                    display: 'none',
                    renderer : function(t, s, c, rd, idx){
                        var data = rd.store.getData().items[idx];
                        return data.get('name') + ' - ' + data.get('value');

                    }
                },
                //highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: 'onSeriesTooltipRender'
                },
                listeners : {
                    pieupdate : function(){
                        console.log('update pie')
                    }
                }
            }],

            listeners: {
                legendclick : function(sprite){
                    alert(sprite.getRecord().get('name'));
                },
                afterrender : 'afterrenderpriorities'
            }

        };



        //this.piechart1 = Ext.widget('polar', pichartConfig);
        this.piechart2 = Ext.widget('panel', {
            frame : true,
            flex : 1,
            layout : 'fit',
            items : {
                xtype : 'box',
                style : 'margin:0 auto',
                html : '<canvas id="Melissa1"></canvas>'
            },
            listeners: {
                boxready: 'onChartJsRender',
                afterlayout : 'onChartJsAfterlayout'
            }
        });
        this.hBarChart = Ext.widget('panel', {
            frame : true,
            flex : 1,
            layout : 'fit',
            items : {
                xtype : 'box',
                style : 'margin:0 auto',
                html : '<canvas id="hBarChart"></canvas>'
            },
            listeners: {
                boxready: 'onHorizontalBarChart',
                afterlayout : 'onChartJsAfterlayout'
            }
        });
        this.plotChart = Ext.widget('panel', {
            frame : true,
            flex : 1,
            layout : 'fit',
            items : {
                xtype : 'box',
                style : 'margin:0 auto',
                html : '<canvas id="plotChart"></canvas>'
            },
            listeners: {
                boxready: 'onPlotChart',
                afterlayout : 'onChartJsAfterlayout'
            }
        });

        this.piechart3 = Ext.widget('panel', {
            flex : 1,
            title : 'D3',
            frame : true,
            html : '<div id="Melissa2"></div>',
            listeners : {
                afterrender : 'onD3Render',
                resize : 'onD3Resize'
            },
            collapsible : true,
            collapseDirection : 'right'
        });

        var piecharts = {
            title : {
                text : '<div style="display:inline-block;width:55%" >Pie-EXTJS</div>' +
                '<div style="display:inline-block; width:45%">Pie-Chart.js</div>',
                flex : 1
            },
            collapseFirst : false,
            collapsible : true,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            flex : 1,
            width : '100%',
            minHeight : 300,
            minWidth : 600,
            defaults : {
                //minHeight : 200,
                //minWidth : 200
            },
            items : [
                piechartConfig
                ,
                this.piechart2
                //,
                //this.piechart3
            ]
        };

        var barchartsH = {
            title : {
                text : '<div style="display:inline-block;width:55%" >Bar-EXTJS</div>' +
                '<div style="display:inline-block; width:45%">Bar-Chart.js</div>',
                flex : 1
            },            collapsible : true,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            flex : 1,
            width : '100%',
            minHeight : 300,
            minWidth : 600,
            defaults : {
                //minHeight : 200,
                //minWidth : 200
            },
            items : [
                barChartHConfig,
                this.hBarChart
            ]
        };

        var plotcharts = {
            title : {
                text : '<div style="display:inline-block;width:55%" >Line-EXTJS</div>' +
                '<div style="display:inline-block; width:45%">Line-Chart.js</div>',
                flex : 1
            },            collapsible : true,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            flex : 1,
            width : '100%',
            minHeight : 300,
            minWidth : 600,
            defaults : {
                //minHeight : 200,
                //minWidth : 200
            },
            items : [
                plotChartConfig,
                this.plotChart
            ]
        }

        this.items = [
            {
                region : 'north',
                collapsible : true,
                title : 'Priority Values',
                xtype :'grid',
                bind : '{priorities}',
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },
                columns : [
                    {
                        header : 'Priority',
                        dataIndex : 'name'
                    },
                    {
                        header : 'Count',
                        dataIndex : 'value',
                        editor: {
                            xtype: 'numberfield',
                            allowDecimal : false,
                            allowBlank: false,
                            minValue: 0
                        }
                    }
                ]
            },
            {
                scrollable : true,
                region : 'center',
                layout : {
                    type : 'vbox'
                },
                items : [
                    piecharts,
                    barchartsH,
                    plotcharts
                ]
            }
        ]

        this.callParent(arguments);
    }
});
