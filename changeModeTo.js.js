    var width = 960,
      height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
      .charge(-120)
      .linkDistance(100)
      .size([width, height]);

    var v = d3.scale.linear()
      .range([0, 100]);
    //-- for pinning down node
    var node_drag = d3.behavior.drag()
      .on("dragstart", dragstart)
      .on("drag", dragmove)
      .on("dragend", dragend);

    function dragstart(d, i) {
      force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy;
    }

    function dragend(d, i) {
      d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
      force.resume();
    }

    function releasenode(d) {
      d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
      //force.resume();
    }
    //-- for pinning down node^   
    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    // build the arrow.
    svg.append("defs").selectAll("marker")
      .data(["direct", "overlap"]) //** Different link/path types can be defined here
      .enter().append("marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 1.5)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")

    d3.csv("les_mis.csv", function(error, data) {
      //set up graph in same style as original example but empty
      graph = {
        "nodes": [],
        "links": []
      };
      //loop through each link record from the csv data
      //add to the nodes each source and target; we'll reduce to unique values later
      //add to the links each source, target record with the value (if desired, multiple value fields can be added)
      data.forEach(function(d) {
        graph.nodes.push({
          "name": d.source,
          "group": +d.groupsource,
          "size": d.size
        });
        graph.nodes.push({
          "name": d.target,
          "group": +d.grouptarget,
          "size": d.size
        });
        graph.links.push({
          "source": d.source,
          "target": d.target,
          "value": +d.value,
          "size": d.size,
          "type": d.type
        });
      });

      //use this as temporary holding while we manipulate graph.nodes
      //this will contain a map object containing an object for each node
      //within each node object there will be a child object for each instance that node appear
      //however, using rollup we can eliminate this duplication
      var nodesmap = d3.nest()
        .key(function(d) {
          return d.name;
        })
        .rollup(function(d) {
          return {
            "name": d[0].name,
            "group": d[0].group,
            "size": d[0].size
          };
        })
        .map(graph.nodes);
      //thanks Mike Bostock https://groups.google.com/d/msg/d3-js/pl297cFtIQk/Eso4q_eBu1IJ
      //this handy little function returns only the distinct / unique nodes
      graph.nodes = d3.keys(d3.nest()
        .key(function(d) {
          return d.name;
        })
        .map(graph.nodes));
      //it appears d3 with force layout wants a numeric source and target
      //so loop through each link replacing the text with its index from node
      graph.links.forEach(function(d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
      });
      //this is not in the least bit pretty
      //will get graph.nodes in its final useable form
      //loop through each unique node and replace with an object with same numeric key and name/group as properties
      //that will come from the nodesmap that we defined earlier
      graph.nodes.forEach(function(d, i) {
        graph.nodes[i] = {
          "name": nodesmap[d].name,
          "group": nodesmap[d].group,
          "size": nodesmap[d].size
        };
      })
      force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

      var path = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", function(d) {
          return "link " + d.type;
        })
        //.style("stroke-width", function (d) { return "marker" + (d.type); })
        .attr("marker-end", function(d) {
          return "url(#" + d.type + ")";
        });

      var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("r", function(d) {
          return d.size;
        })
        .style("fill", function(d) {
          return color(d.group);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", click)
        .on("dblclick", dblclick)
        .on("dblclick", releasenode)
        .call(node_drag);

      var size = d3.scale.pow().exponent(1)
        .domain([1, 100])
        .range([8, 24]);

      var nominal_base_node_size = 5;
      var max_base_node_size = 35;
      var nominal_text_size = 5;
      var max_text_size = 25;

      // add the nodes
      node.append("circle")
        .style("fill", function(d) {
          return color(d.group);
        })
        .attr("r", function(d) {
          return d.size;
        });

      // add the text				
      node.append("text")
        //.attr("x", 15)
        //.attr("dy", ".35em")
        .text(function(d) {
          return d.name;
        })
        .style("fill", function(d) {
          return color(d.group);
        });

      force.on("tick", function() {
        path.attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        d3.selectAll("circle").attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
        d3.selectAll("text").attr("x", function(d) {
            return d.x + 21;
          })
          .attr("y", function(d) {
            return d.y + 7;
          });
      });

      function mouseover() {
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 30);
      }

      function mouseout() {
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", function(d) {
            return d.size;
          });
      }

      function click() {
        //d3.select(this).select("text").transition() 
        //.duration(750)
        //.attr("x", 22)
        //.style("fill", "grey")  
        //.style("stroke", "lightsteelblue")
        //.style("stroke-width", ".5px")  
        //.style("font", "20px sans-serif"); 
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 16)
          .style("fill", function(d) {
            return color(d.group);
          });
      }

      function dblclick() {
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 6)
          .style("fill", function(d) {
            return color(d.group);
          });
        d3.select(this).select("text").transition()
          .duration(750)
          .attr("x", function(d) {
            return d.size;
          })
          .style("stroke", "none")
          .style("fill", function(d) {
            return color(d.group);
          });
      }

      function dragstart(d, i) {
        d3.select(this).classed("fixed", d.fixed = true);
      }
      
      var select = d3.select("#searchName")
        .append("select")
        .on('change', searchNode);

      select.selectAll("option")
        .data(graph.nodes)
        .enter()
        .append("option")
        .attr("value", function(d) {return d.name;})
        .text(function(d) {
            return d.name; 
        });


    });

    function searchNode() {

      //find the node
      var selectedVal = this.options[this.selectedIndex].value

      var node = svg.selectAll(".node");

      if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
      } else {
        var selected = node.filter(function(d, i) {
          return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
          .duration(2000)
          .style("opacity", 1);


      }
    }
  
    var changeModeTo = function(mode) {
        editor.session.setMode("ace/mode/" + mode.value);
    };