/**
 * Highcharts plugin for avoid series label overlap
 * 
 * Author: Aurélien Doignon
 * Last revision: 2013-10-31
 * Version: 0.1.0
 */
(function(H) {
    
    var chartLabels = {};
    
    H.wrap(H.Chart.prototype, 'render', function(proceed) {
        
        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        // Save labels of this graphe
        var chart = this;
        chartLabels[chart.index] = [];

        // Foreach series in the chart
        each(chart.series, function(serie_index, serie) {
            // Take each label of points
            each(serie.data, function(data_index, point) {
                if (typeof(point.dataLabel) != 'undefined') {
                    chartLabels[chart.index].push(point.dataLabel);
                }
            });
        });

        // Treatement of labels
        each(chartLabels[chart.index], function(label_index, label) {

            var condition = true,
                tests = [{
                    coef: 1,
                    y: label.y
                }, {
                    coef: -1,
                    y: label.y - 1
                }];

            // While condition var is true
            while (condition) {
                
                // Running both tests to ajust y value and look which is the best
                each(tests, function(test_index, test) {
                    var overlap = false;

                    // Each previous label in array is tested
                    each(chartLabels[chart.index], function(_label_index, _label) {
                        if (_label_index < label_index && isOverlap(label, _label)) {
                            overlap = true;
                        }
                    });

                    // y value update
                    test.y += test.coef;

                    // Verify if the new label y position is not below the xAxis
                    if (test.y + label.height < chart.xAxis[0].lineTop) {
                        
                        // If overlap, set the new y. If not end of while
                        if (overlap) {
                            label.attr({y: test.y});
                        } else {
                            condition = false;
                        }
                        
                    }
                });
            }
        });
    });
    
    /**
     * Implementation of jQuery each function
     * @param {array|object} data Data
     * @param {function} callback Processing function
     * @returns {array|object} Data after processing
     */
    function each(data, callback) {        
        for(var i = 0; i < data.length; i++) {
            callback(i, data[i]);
        }
        return data;
    }

    /**
     * Verify if Highchart label_2 overlap label_1
     * @param {object} label_1
     * @param {object} label_2
     * @returns {bool} True if overlap is detected
     */
    function isOverlap(label_1, label_2) {
        return (
            (label_2.x >= label_1.x && label_2.x <= label_1.width + label_1.x) ||
            (label_2.width + label_2.x >= label_1.x && label_2.width + label_2.x <= label_1.width + label_1.x)
            ) && (
            (label_2.y >= label_1.y && label_2.y <= label_1.height + label_1.y) ||
            (label_2.height + label_2.y >= label_1.y && label_2.height + label_2.y <= label_1.height + label_1.y)
        );
    }
    
}(Highcharts));