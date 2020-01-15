d3.select("h2")
  .text("A really simple description")

let svg = d3.select("svg")

svg
  .append("circle")
  .attr("cx", 175)
  .attr("cy", 50)
  .attr("r", 50)
  .style("fill", "yellow")
  .style("opacity", 0.5)

 svg 
  .style("background-color", "skyblue")
  .style("opacity", 0.3)

svg
  .append("rect")
  .attr("width", 600)
  .attr("height", 200)
  .style("stroke", "navy")
  .style("stroke-width", "20")
  .style("opacity", 1.0)
  .style("fill", "transparent")

d3.select("svg text")
  .transition()
  .duration(2000)
  .attr("color", "transparent")
  .remove()

 for (let i = 1; i <= 10; i++) {
   svg.append("circle")
     .attr("cx", 300 + 20 * i)
     .attr("cy", 100)
     .attr("r", 10 + 5 * i)
     .style("fill", "transparent")
     .style("stroke", "red")
 }

 let chessboard = size => {

   let squareSize = size / 8

   d3.select("body")
     .append("h2")
     .text(`A ${size} x ${size} chess board`)

  let svg = 
    d3.select("body")
    .append("svg")
    .attr("width", size)
    .attr("height", size)

  for (let row = 0; row < 8; row ++){
    for (let col = 0; col < 8; col ++){
      svg.append("rect")
        .attr("x", col * squareSize)
        .attr("y", row * squareSize)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", 
          (row + col) % 2 === 0 ? "black" : "white")
        .style("stroke", "black")
    }
  }
  
 }

 chessboard(200)

 chessboard(300)



