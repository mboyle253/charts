Ext.define('Charts.view.main.ClickSpriteLegend', {
    extend: 'Ext.chart.legend.SpriteLegend',
    alias: 'legend.clicksprite',
    toggleItem: function (sprite) {
        this.callParent(arguments);
        this.getChart().fireEvent('legendclick', sprite);
    },
    applyBorder: function (config) {
        var border;

        if (config) {
            if (config.isSprite) {
                border = config;
            } else {
                border = Ext.create('sprite.' + config.type, config);
            }
        }
        if (border) {
            border.setAttributes({
                hidden : true
            });
        }

        return border;
    },
    performLayout: function () {
        var me = this,
            size = me.getSize(),
            gap = me.getPadding(),
            sprites = me.getSprites(),
            surface = me.getSurface(),
            background = me.getBackground(),
            surfaceRect = surface.getRect(),
            store = me.getStore(),
            ln = (sprites && sprites.length) || 0,
            result = true,
            i, sprite;

        if (!surface || !surfaceRect || !store) {
            return false;
        }

        me.cancelLayout();

        var docked = me.getDocked(),
            surfaceWidth = surfaceRect[2],
            surfaceHeight = surfaceRect[3],
            border = me.borderSprite,
            bboxes = [],
            startX,      // Coordinates of the top-left corner.
            startY,      // of the first 'legenditem' sprite.
            columnSize,  // Number of items in a column.
            columnCount, // Number of columns.
            columnWidth,
            itemsWidth,
            itemsHeight,
            paddedItemsWidth,  // The horizontal span of all 'legenditem' sprites.
            paddedItemsHeight, // The vertical span of all 'legenditem' sprites.
            paddedBorderWidth,
            paddedBorderHeight,
            itemHeight,
            bbox, x, y;

        for (i = 0; i < ln; i++) {
            sprite = sprites[i];
            bbox = sprite.getBBox();
            bboxes.push(bbox);
        }

        if (bbox) {
            itemHeight = bbox.height;
        }

        switch (docked) {
            /*

             Horizontal legend.
             The outer box is the legend surface.
             The inner box is the legend border.
             There's a fixed amount of padding between all the items,
             denoted by ##. This amount is controlled by the 'padding' config
             of the legend.

             |-------------------------------------------------------------|
             |                             ##                              |
             |    |---------------------------------------------------|    |
             |    |        ##              ##               ##        |    |
             |    |     --------        -----------      --------     |    |
             | ## | ## | Item 0 |   ## | Item 2    | ## | Item 4 | ## | ## |
             |    |     --------        -----------      --------     |    |
             |    |        ##              ##               ##        |    |
             |    |     ----------      ---------                     |    |
             |    | ## | Item 1   | ## | Item 3  |                    |    |
             |    |     ----------      ---------                     |    |
             |    |        ##              ##                         |    |
             |    |---------------------------------------------------|    |
             |                             ##                              |
             |-------------------------------------------------------------|

             */
            case 'bottom':
            case 'top':

                // surface must have a width before we can proceed to layout top/bottom
                // docked legend.  width may be 0 if we are rendered into an inactive tab.
                // see https://sencha.jira.com/browse/EXTJS-22454
                if (!surfaceWidth) {
                    return false;
                }

                columnSize = 0;

                // Split legend items into columns until the width is suitable.
                do {
                    itemsWidth = 0;
                    columnWidth = 0;
                    columnCount = 0;

                    columnSize++;

                    for (i = 0; i < ln; i++) {
                        bbox = bboxes[i];
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        if ((i + 1) % columnSize === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount++;
                        }
                    }
                    if (i % columnSize !== 0) {
                        itemsWidth += columnWidth;
                        columnCount++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount - 1) * gap;
                    paddedBorderWidth = paddedItemsWidth + gap * 4;

                } while (paddedBorderWidth > surfaceWidth);

                paddedItemsHeight = itemHeight * columnSize + (columnSize - 1) * gap;

                break;

            /*

             Vertical legend.

             |-----------------------------------------------|
             |                     ##                        |
             |    |-------------------------------------|    |
             |    |        ##               ##          |    |
             |    |     --------        -----------     |    |
             |    | ## | Item 0 |   ## | Item 1    | ## |    |
             |    |     --------        -----------     |    |
             |    |        ##               ##          |    |
             |    |     ----------      ---------       |    |
             | ## | ## | Item 2   | ## | Item 3  |      | ## |
             |    |     ----------      ---------       |    |
             |    |        ##                           |    |
             |    |     --------                        |    |
             |    | ## | Item 4 |                       |    |
             |    |     --------                        |    |
             |    |        ##                           |    |
             |    |-------------------------------------|    |
             |                     ##                        |
             |-----------------------------------------------|

             */

            case 'right':
            case 'left':

                // surface must have a height before we can proceed to layout right/left
                // docked legend.  height may be 0 if we are rendered into an inactive tab.
                // see https://sencha.jira.com/browse/EXTJS-22454
                if (!surfaceHeight) {
                    return false;
                }

                columnSize = ln * 2;

                // Split legend items into columns until the height is suitable.
                do {
                    // Integer division by 2, plus remainder.
                    columnSize = (columnSize >> 1) + (columnSize % 2);

                    itemsWidth = 0;
                    itemsHeight = 0;
                    columnWidth = 0;
                    columnCount = 0;

                    for (i = 0; i < ln; i++) {
                        bbox = bboxes[i];
                        // itemsHeight is determined by the height of the first column.
                        if (!columnCount) {
                            itemsHeight += bbox.height;
                        }
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        if ((i + 1) % columnSize === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount++;
                        }
                    }
                    if (i % columnSize !== 0) {
                        itemsWidth += columnWidth;
                        columnCount++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount - 1) * gap;
                    paddedItemsHeight = itemsHeight + (columnSize - 1) * gap;
                    paddedBorderWidth = paddedItemsWidth + gap * 4;
                    paddedBorderHeight = paddedItemsHeight + gap * 4;

                } while (paddedItemsHeight > surfaceHeight);

                break;

        }

        startX = (surfaceWidth - paddedItemsWidth) / 2;
        startY = (surfaceHeight - paddedItemsHeight) / 2;

        x = 0;
        y = 0;
        columnWidth = 0;

        for (i = 0; i < ln; i++) {
            sprite = sprites[i];
            bbox = bboxes[i];
            sprite.setAttributes({
                translationX: startX + x,
                translationY: startY + y
            });
            if (bbox.width > columnWidth) {
                columnWidth = bbox.width;
            }
            if ((i + 1) % columnSize === 0) {
                x += columnWidth + gap;
                y = 0;
                columnWidth = 0;
            } else {
                y += bbox.height + gap;
            }
        }

        if (border) {
            border.setAttributes({
                x: startX - gap,
                y: startY - gap,
                width: gap * 2,
                height: gap * 2
            });
        }

        size.width = border.attr.width + gap * 2;
        size.height = border.attr.height + gap * 2;

        if (size.width !== me.oldSize.width || size.height !== me.oldSize.height) {
            // Do not simply assign size to oldSize, as we want them to be
            // separate objects.
            Ext.apply(me.oldSize, size);
            // Legend size has changed, so we return 'false' to cancel the current
            // chart layout (this method is called by chart's 'performLayout' method)
            // and manually start a new chart layout.
            result = false;
            me.getChart().performLayout();
        }

        Ext.apply(me.oldSize, size);

        if (background) {
            me.resizeBackground(surface, background);
        }

        surface.renderFrame();

        return result;
    },

});
