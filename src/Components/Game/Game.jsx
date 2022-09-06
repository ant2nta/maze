/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import "./Game.scss";
import { mapFromServer } from "../../Map/map";
import { useLocaleStorage } from "../../useLocaleStorage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import img from "../../Map/map.png";

const Game = () => {
  const [map, setMap] = useLocaleStorage('map', {});
  const [position, setPosition] = useLocaleStorage('position', '');
  const [history, setHistory] = useLocaleStorage('history', []);
  const [hp, setHp] = useLocaleStorage('hp', 0);
  const [coins, setCoins] = useLocaleStorage('coins', 0);
  const [maxCoins, setMaxCoins] = useLocaleStorage('maxCoins', 0);
  const [finished, setFinished] = useLocaleStorage('finished', null);
  const [btnDisabled, setBtnDisabled] = useLocaleStorage('btnDisabled', {});
  const [hasKey, setHasKey] = useLocaleStorage('hasKey', false);
  const [open, setOpen] = useState(false);

  const resetOptions = () => {
    setMap(mapFromServer);
    setPosition(mapFromServer.start);
    setHistory([]);
    setHp(mapFromServer.hp.max);
    setCoins(0);
    setMaxCoins(mapFromServer.items.coins.length);
    setFinished(null);
    setHasKey(false);
    checkBtnDisabled();
  };

  const checkBtnDisabled = () => {
    setBtnDisabled({
      up: !map.ways[position].includes(`${+position[0] - 1} ${position[2]}`),

      left: !map.ways[position].includes(`${position[0]} ${+position[2] - 1}`),

      right: !map.ways[position].includes(`${position[0]} ${+position[2] + 1}`),

      down: !map.ways[position].includes(`${+position[0] + 1} ${position[2]}`),
    });
  };

  useEffect(resetOptions, []);

  useEffect(checkBtnDisabled, []);

  useEffect(() => {
    if (position === map.finish) {
      setFinished("win");
    }

    checkBtnDisabled();
  }, [position]);

  const newGame = () => {
    confirmAlert({
      title: finished === 'win' ? 'Congratulation!' : 'Oops',
      message: finished === 'win'
        ? `You passed the maze and collect ${coins} coins. Want to start new game?`
        : `You die, and collect ${coins} coins. Want to start new game?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => resetOptions(),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const doStep = async (step) => {
    if (!finished) {
      const newHistory = [];
      let newPosition;

      /* new position */
      switch (step) {
        case "up":
          newPosition = `${+position[0] - 1} ${position[2]}`;
          break;

        case "left":
          newPosition = `${position[0]} ${+position[2] - 1}`;
          break;

        case "right":
          newPosition = `${position[0]} ${+position[2] + 1}`;
          break;

        case "down":
          newPosition = `${+position[0] + 1} ${position[2]}`;
          break;

        default:
          break;
      }

      /* add position to history */
      newHistory.push([`[${position.split(" ")}] > [${newPosition.split(" ")}]`]);

      /* if locked */
      if (map.items.lock.includes(newPosition)) {
        if (!hasKey) {
          setHistory(["You need a key!", ...history]);

          return;
        }

        if (!history.includes("Unlocked!")) {
          newHistory.push("Unlocked!");
        }
      }

      /* if found key */
      if (map.items.key.includes(newPosition)) {
        if (!hasKey) {
          setHasKey(true);

          newHistory.push("You just found the key!");
        }
      }

      /* if found coin */
      if (map.items.coins.includes(newPosition)) {
        const nowCoins = coins + 1;

        map.items.coins = map.items.coins.filter((el) => el !== newPosition);

        if (nowCoins !== maxCoins) {
          newHistory.push(`It's coin! ${coins + 1}/${maxCoins}`);
        } else {
          newHistory.push(`You found all the coins!`);
        }

        setCoins(nowCoins);
      }

      /* taking damage */
      if (Object.keys(map.hp.damage).includes(newPosition)) {
        const damage = map.hp.damage[newPosition];

        await delete map.hp.damage[newPosition];

        newHistory.push(`It was a trap, -${damage} HP`);
        setHp(hp - damage);

        if (hp - damage <= 0) {
          setFinished("loose");

          return;
        }
      }

      /* healing */
      if (Object.keys(map.hp.heal).includes(newPosition)) {
        const heal = map.hp.heal[newPosition];

        await delete map.hp.heal[newPosition];

        newHistory.push(`Good luck! +${heal} HP`);

        if (hp + heal > 100) {
          setHp(100);
        } else {
          setHp(hp + heal);
        }
      }

      /* portal to another position */
      if (Object.keys(map.teleport).includes(newPosition)) {
        newPosition = map.teleport[newPosition].join("");

        newHistory.push(`It's portal! You are at [${newPosition.split(" ")}]`);
      }

      /* add history */
      setHistory([...newHistory.reverse(), ...history]);

      /* set new position */
      setPosition(newPosition);
    }
  };

  return map ? (
    <div className="game">
      {finished && newGame()}
      <div className="game__main">
        <div className="game__info">
          <span className="game__status">
            <p>
              {`Position: ${position.split(" ")}`}
            </p>

            <p>
              {`Map size: ${map.size}`}
            </p>
          </span>
          
          <span className="game__status">      
            <p className="game__hp">
              {`HP: ${hp}`}

              <div
                className="game__hp-bgc"
                style={{width: `${hp}%`}}
              />
            </p>

            <p className="game__coins">
              {`Coins: ${coins}/${maxCoins}`}

              <div
                className="game__coins-bgc"
                style={{width: `${coins * 100 / maxCoins}%`}}
              />
            </p>
          </span>
        </div>

        <div className="game__buttons">
          <div className="open">
            <p className="open__btn" onClick={() => setOpen(!open)}>
              {`${open ? 'Close' : 'Open'} map (ONLY IN DEMO)`}
            </p>
            {open && (
              <img className="open__img" src={img} alt="full map" />
            )}
          </div>

          <div className="buttons">
            <button
              className="buttons__up"
              onClick={() => doStep("up")}
              disabled={btnDisabled.up}
            >
              ˄
            </button>

            <button
              className="buttons__left"
              onClick={() => doStep("left")}
              disabled={btnDisabled.left}
            >
              ˂
            </button>

            <button
              className="buttons__right"
              onClick={() => doStep("right")}
              disabled={btnDisabled.right}
            >
              ˃
            </button>

            <button
              className="buttons__down"
              onClick={() => doStep("down")}
              disabled={btnDisabled.down}
            >
              ˅
            </button>
          </div>
        </div>
      </div>

      <div className="game__logs logs">
        <h2 className="logs__title">Game logs</h2>
        <div className="logs__list">
          {history.map((el) => (
            <p key={Math.random()}>{el}</p>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <h1>Map is not found</h1>
  );
};

export default Game;
