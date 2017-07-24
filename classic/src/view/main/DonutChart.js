Ext.define('Charts.view.main.DonutChart', {
    extend: 'Ext.chart.PolarChart',
    xtype: 'donutchart',
    requires: [
        'Charts.view.main.PieCenter',
        'Charts.view.main.ClickSpriteLegend'
    ],
    constructor: function (config) {
        config.legend = {
            type : 'clicksprite',
                toggleable : false,
                docked: 'top'
        };

        config.series = [{
            type: 'piecenter',
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
            tooltip: {
                trackMouse: true,
                renderer: this.onSeriesTooltipRender
            }
        }];

        this.callParent(arguments);
    },
    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('name') + ': ' + record.get('value') );
    },
    listeners : {
        legendclick : function(sprite){
            alert(sprite.getRecord().get('name'));
        },
        afterrender : function(chart){
            // Add in the center total value
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
                    text: chart.getStore().sum(series.totalValue),
                    textAlign : 'center',
                    fontSize : fontSize + 'px',
                    width : '100%',
                    x: (center[0] + series.getOffsetX()),
                    y: (center[1] + series.getOffsetY() + (fontSize/2))
                });

                sprite.show(true);
            }, d, this);

        }
    }
});