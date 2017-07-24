Ext.define('Charts.view.main.PieCenter', {
    extend: 'Ext.chart.series.Pie',
    alias : 'series.piecenter',
    totalValue : 'value',
    updateLabelData : function(){
        var me = this;
        me.callParent();

        // Update center total
        var chart = me.getChart();
        if (!chart.isConfiguring) {
            var surface = me.getChart().getSurface();

            // It is expected that surface.getItems()[0] will return
            // the center total sprite
            var sprite = surface.getItems()[0];
            if (sprite){
                sprite.setAttributes({
                    text : chart.getStore().sum(me.totalValue)
                });
            }
        }
    },
    updateCenter: function (center) {
        this.setStyle({
            translationX: center[0] + this.getOffsetX(),
            translationY: center[1] + this.getOffsetY()
        });
        var surface = this.getChart().getSurface(),
            rect = surface.getRect();
        var fontSize = rect ? Math.floor(this.getRadius() * .25) : false;

        var sprite = surface.getItems()[0];
        if (sprite){
            sprite.setAttributes({
                x: (center[0] + this.getOffsetX()),
                y: (center[1] + this.getOffsetY() + (fontSize/2)),
                fontSize : fontSize ? fontSize + 'px' :
                    sprite.getAttribute('fontSize')
            });
        }
        this.doUpdateStyles();
    }
})