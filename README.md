[DEMO](https://ant2nta.github.io/maze/)

Created with React framework

To run locally:

```
npm i
npm start
```

Map could be uploaded from server, and created with rules:

```
{
  size: [x, y],
  start: 'x y',
  finish: 'x y',
  items: {
    lock: array 'x y',
    key: array 'x y',
    coins: array 'x y',
  },
  hp: {
    max: number,
    damage: object 'x y': number,
    heal: object 'x y': number,
  },
  teleport: object 'x y': number,
  ways: object 'x y': array 'x y',
}   
```
Example in `src/Map/map.js`
