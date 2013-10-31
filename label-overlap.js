/**
 * Highcharts plugin for avoid series label overlap
 * 
 * Author: Aurélien Doignon
 * Last revision: 2013-10-31
 * Version: 0.1.0
 */
(function(H) {
        
    H.wrap(H.Chart.prototype, 'render', function(proceed) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        // Save labels of this graphe
        var labels = [], 
            chart = this;

        // Foreach series in the chart
        each(chart.series, function(serie_index, serie) {

            each(serie.data, function(data_index, point) {
                if (typeof(point.dataLabel) != 'undefined') {
                    labels.push(point.dataLabel);
                }
            });
        });

        // Treatement of labels
        each(labels, function(label_index, label) {

            var condition = true;
            var tests = [{
                    coef: 1,
                    y: label.y
                }, {
                    coef: -1,
                    y: label.y - 1
                }];


            while (condition) {
                each(tests, function(test_index, test) {
                    var overflow = false;

                    each(labels, function(_label_index, _label) {
                        if (_label_index < label_index && isOverlap(label, _label)) {
                            overflow = true;
                        }
                    });

                    test.y += test.coef;

                    if (test.y + label.height < chart.xAxis[0].lineTop) {
                        if (overflow) {
                            label.attr({y: test.y});
                        } else {
                            condition = false;
                        }
                    }
                });
            }
        });
    });
    
    function each(data, callback) {        
        for(var i = 0; i < data.length; i++) {
            callback(i, data[i]);
        }
    }

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