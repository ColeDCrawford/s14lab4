/**
 * @class Scatterplot
 */
class Scatterplot {

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Config
    svgWidth = 360;
    svgHeight = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gWidth = this.svgWidth - (this.gMargin.right + this.gMargin.left);
    gHeight = this.svgHeight - (this.gMargin.top + this.gMargin.bottom);

    // Scales and axes
    scaleX = d3.scaleLinear()
        .range([0, this.gWidth]);
        //.domain([]);
    scaleY = d3.scaleLinear()
        .range([this.gHeight, 0]);
        //.domain([]);
    xAxis = d3.axisBottom()
        .scale(this.scaleX);
    yAxis = d3.axisLeft()
        .scale(this.scaleY);
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
            .attr('width', vis.svgWidth)
            .attr('height', vis.svgHeight);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes and labels
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'xaxis axis')
            .style('transform', `translateY(${vis.gHeight + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label xlabel')
            .style('transform', `translate(${vis.gWidth / 2}px, 40px)`)
            .style('text-anchor', 'middle')
            .text('Years of Experience');

        vis.yAxisG = vis.g.append('g')
            .attr('class', 'yaxis axis')
            .style('transform', 'translateX(-15px)');;
        vis.yAxisG.append('text')
            .attr('class', 'label ylabel')
            .style('text-anchor', 'middle')
            .style('transform', `rotate(-90deg) translate(-${vis.gHeight / 2}px, -30px)`)
            .text('Homework Hours');

        // legend

        // tooltip
        vis.tooltip = d3.select(`#${vis.target}`)
            .append('div')
            .attr('class', 'details')
            .style('opacity', 0);

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

        vis.experienceArr = vis.data.map(d => d.experience_yr);
        vis.hoursArr = vis.data.map(d => d.hw1_hrs);

        // Update scales
        vis.scaleX.domain([
            0,
            d3.max(vis.experienceArr)
        ]);
        vis.scaleY.domain([
            0,
            d3.max(vis.hoursArr)
        ]);

        // Group data to handle collisions on scatterplot (eg multiple circles at same point)
        // Inspired by https://stackoverflow.com/questions/46794232/group-objects-by-multiple-properties-in-array-then-sum-up-their-values#answer-46794337
        function groupBy(data, prop1, prop2){
          var helper = {};
          var result = data.reduce(function(r, obj) {
            var key = obj[prop1] + '-' + obj[prop2];
            if(!helper[key]) {
              helper[key] = [Object.assign({}, obj)];
              r.push(helper[key]);
            } else {
              helper[key].push(Object.assign({}, obj))
            }

            return r;
          }, []);
          return result;
        }

        vis.groupedData = groupBy(vis.data, 'experience_yr', 'hw1_hrs');

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

        // Functions to render tooltip HTML via JS templating - use because of grouped data (scatterplot collisions)
        // Keep outside of data.join()
        function render_people(data){
            let people = ''
            data.forEach(function(person){
                people += render_person(person);
            })
            return `
                <div class='people'>
                    ${people}
                </div>
            `
        }
        function render_person(data){
            return `
                <div class='person' id='${data.uid}'>
                    <div class='name'>${data.first_name} ${data.last_name}</div>
                    <div class='attributes'>Exp: ${data.experience_yr}, Hours: ${data.hw1_hrs}, Lang: ${data.prog_lang}</div>
                </div>
            `
        }

        vis.points = vis.g.selectAll('.point')
            .data(vis.groupedData);
        vis.points.join(
            enter => enter
                .append('g')
                .attr('class', 'pointG')
                .each(function(d){
                    const g = d3.select(this);
                    g.append('circle')
                        .attr('class', 'point')
                        .attr('r', function(d){
                            return ((6 * Math.sqrt(d.length))/2);
                        })
                        .attr('cx', function(d){
                            return vis.scaleX(d[0].experience_yr);
                        })
                        .attr('cy', function(d){
                            return vis.scaleY(d[0].hw1_hrs);
                        })
                        .on('mouseover', function(d){
                            vis.tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            vis.tooltip.html(render_people(d))
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                            d3.select(this)
                              .style("fill", "#ffa600"); // temp
                        })
                        .on("mouseout", function(d){
                          vis.tooltip.transition()
                            .duration(200)
                            .style("opacity", 0);
                            d3.select(this)
                                .style("fill", "#955196");
                        });
                }),
            update => update,
            exit => exit
                .remove()
        );

        // Update axes
        vis.yAxisG.call(vis.yAxis);
        vis.xAxisG.call(vis.xAxis);

    }
}
