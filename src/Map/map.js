export const mapFromServer = {
  size: [5, 5],
  start: "1 1",
  finish: "5 3",
  items: {
    lock: ["4 5"],
    key: ["4 1"],
    coins: ["2 3", "3 2", "3 3", "4 4"],
  },
  hp: {
    max: 100,
    damage: {
      "1 4": 25,
      "2 2": 25,
      "4 3": 25,
      "5 1": 25,
      "5 5": 50,
    },
    heal: {
      "2 5": 50,
    },
  },
  teleport: {
    "5 5": ["1 1"],
  },
  ways: {
    "1 1": ["1 2", "2 1"], //start
    "1 2": ["1 1", "1 3"],
    "1 3": ["1 2", "2 3"],
    "1 4": ["1 5", "2 4"], //-25
    "1 5": ["1 4"],
    "2 1": ["1 1", "3 1"],
    "2 2": ["2 3"], //-25
    "2 3": ["2 2", "1 3", "2 4"], //coin
    "2 4": ["2 3", "1 4", "3 4"],
    "2 5": ["3 5"], //+50
    "3 1": ["2 1", "3 2"],
    "3 2": ["3 1", "4 2"], //coin
    "3 3": ["3 4", "4 3"], //coin
    "3 4": ["2 4", "3 3", "3 5"],
    "3 5": ["3 4", "2 5", "4 5"],
    "4 1": ["4 2"], //key
    "4 2": ["3 2", "4 1", "5 2"],
    "4 3": ["3 3"], //-25
    "4 4": ["4 5", "5 4"], //coin
    "4 5": ["3 5", "4 4"], //lock
    "5 1": ["5 2"], //-25
    "5 2": ["4 2", "5 1"],
    "5 3": [], //finish
    "5 4": ["4 4", "5 3", "5 5"],
    "5 5": [], //portal to start, -50
  },
};