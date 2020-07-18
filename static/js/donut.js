/**
 * @class Template
 */
class Donut {

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 360;
    svgH = 360;
    // gMargin = {top: 25, right: 25, bottom: 75, left: 75};
    gMargin = {top: 10, right: 10, bottom: 10, left: 10};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    radius = Math.min(this.gW, this.gH) / 2 - this.gMargin.left - this.gMargin.right;
    innerRadius = 100;

    // scales
    colorScale = d3.scaleOrdinal()
        .range([
            '#003f5c',
            '#444e86',
            '#955196',
            '#dd5182',
            '#ff6e54',
            '#ffa600'
        ])

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // data display
        vis.display = vis.g
            .append('g')
            .attr('class', 'pie-data-display');
        vis.displayLang = vis.display
            .append('text')
            .attr('class', 'label pieLang')
            .style('text-anchor', 'middle')
            .text('Language');
        vis.displayCount = vis.display
            .append('text')
            .attr('class', 'label pieCount')
            .style('text-anchor', 'middle')
            .style('transform', `translateY(30px)`)
            .text('Count');

        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;

        function groupBy(arr, prop){
            return arr.reduce(function(result, obj){
                let key = obj[prop];
                if(!result[key]){
                    result[key] = 1;
                } else {
                    result[key]++;
                }
                return result
            }, {})
        }

        vis.wrangled = groupBy(vis.data, 'prog_lang');
        vis.pieFunc = d3.pie()
            .value(function(d){
                return d.value;
            })
        vis.pie_data = vis.pieFunc(d3.entries(vis.wrangled));
        console.log(vis.pie_data);

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        vis.pie = vis.g.selectAll('.arc')
            .data(vis.pie_data)
        vis.pie.join(
            enter => enter
                .append('g')
                .attr('class', 'arcG')
                .each(function(d){
                    const g = d3.select(this);
                    g.append('path')
                        .attr('class', 'arc')
                        .attr('d', d3.arc()
                            .innerRadius(vis.innerRadius)
                            .outerRadius(vis.radius)
                        )
                        .attr('fill', function(d){
                            return vis.colorScale(d.data.key);
                        })
                        .on('mouseover', function(d){
                            vis.displayCount.text(d.data.value);
                            vis.displayLang.text(d.data.key);
                            d3.select(this)
                                .style('stroke-width', '4px')
                                .style('opacity', 1);
                        })
                        .on('mouseout', function(d){
                            vis.displayCount.text('Language');
                            vis.displayLang.text('Count');
                            d3.select(this)
                                .style('stroke-width', 'initial')
                                .style('opacity', 'initial');
                        })
                }),
                update => update,
                exit => exit
                    .remove()
        )

    }
}
