Ext.define('Charts.view.main.ClickSpriteLegend', {
    extend: 'Ext.chart.legend.SpriteLegend',
    alias: 'legend.clicksprite',
    toggleItem: function (sprite) {
        this.callParent(arguments);
        this.getChart().fireEvent('legendclick', sprite);
    }
});
