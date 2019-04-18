import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Plot from 'react-plotly.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      points: [],
      hullPoints: []
    };
  }

  plotRandom = () => {
    const numOfPts = Math.floor(Math.random() * 100) + 1;
    let newPoints = [];
    for (let x = 0; x < numOfPts; x++) {
      newPoints.push({
        x: Math.floor(Math.random() * 100) - 50,
        y: Math.floor(Math.random() * 100) - 50
      });
    }

    this.setState({points: newPoints, hullPoints: []});
  }

  removeMiddle = (a, b, c) => {
    var cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    var dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
    return cross < 0 || (cross === 0 && dot <= 0);
  }

  getHull = () => {
    const {points} = this.state;
    points.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    var n = points.length;
    var hull = [];

    for (var i = 0; i < 2 * n; i++) {
      var j = i < n ? i : 2 * n - 1 - i;
      while (hull.length >= 2 && this.removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j])) {
        hull.pop();
      }
      hull.push(points[j]);
    }

    // hull.pop();
    this.setState({hullPoints: hull});
  }

  getHullPoints = axis => this.state.hullPoints.map(pair => pair[axis]);
  getNonHullPoints = axis => this.state.points.map(pair => pair[axis]);

  render() {
    return (
      <div>
        <Plot
          data={[
            {
              x: this.getHullPoints('x'),
              y: this.getHullPoints('y'),
              mode: 'lines+markers',
              marker: {color: 'red'}
            },
            {
              mode: 'markers',
              x: this.getNonHullPoints('x'),
              y: this.getNonHullPoints('y'),
              marker: {color: 'blue'}
            }
          ]}
          layout={ {width: 600, height: 600, title: 'Convex Hull'} }
        />
        <button onClick={this.plotRandom}>get new random points</button>
        <button onClick={this.getHull}>find convex hull</button>
      </div>
    );
  }
}

export default App;
