import { useState, useEffect, useCallback } from 'react';
import Bird, { BIRD_HEIGHT, BIRD_WIDTH } from './Bird';
import Pipe, { OBSTACLE_WIDTH } from './Pipe';

const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const GRAVITY = 0.2;
const JUMP_FORCE = -4.7;
const TERMINAL_VELOCITY = 6;
const OBSTACLE_GAP = 200;
const INITIAL_SPEED = 5;
const SPEED_INCREASE = 1;
const SPEED_INCREASE_INTERVAL = 3;

function Game() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2 - BIRD_HEIGHT / 2);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [puffs, setPuffs] = useState([]);
  const [velocity, setVelocity] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  const createPuff = useCallback(() => {
    const puff = {
      id: Date.now(),
      top: birdPosition + BIRD_HEIGHT/2,
      left: GAME_WIDTH * 0.2 - 10  // Start slightly behind the bird
    };
    
    setPuffs(currentPuffs => [...currentPuffs, puff]);
    
    setTimeout(() => {
      setPuffs(currentPuffs => currentPuffs.filter(p => p.id !== puff.id));
    }, 500);
  }, [birdPosition]);

  const handleAction = useCallback((e) => {
    // Prevent default for spacebar
    if (e.code === 'Space') {
      e.preventDefault();
    }

    // If game is over, only allow clicks on the Start button
    if (isGameOver) {
      // Only handle Enter key, ignore all click events
      if (e.code === 'Enter') {
        restartGame();
      }
      return;
    }
    
    // Handle jump action for normal gameplay
    if (e.code === 'Space' || e.type === 'click') {
      if (!started) {
        setStarted(true);
      }
      setVelocity(JUMP_FORCE);
      createPuff();
    }
  }, [started, isGameOver, createPuff]);

  // Separate handler for the Start button
  const handleStartClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to game container
    restartGame();
  };

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleAction);
    return () => {
      window.removeEventListener('keydown', handleAction);
    };
  }, [handleAction]);

  useEffect(() => {
    let frameId;
    if (started && !isGameOver) {
      const updatePhysics = () => {
        setBirdPosition(pos => {
          const newPos = pos + velocity;
          // Check boundaries
          if (newPos <= 0 || newPos >= GAME_HEIGHT - BIRD_HEIGHT) {
            gameOver();
            return pos;
          }

          // Check pipe collisions
          const birdLeft = GAME_WIDTH * 0.2;
          const birdRight = birdLeft + BIRD_WIDTH;
          
          if (
            obstacleLeft < birdRight && 
            obstacleLeft + OBSTACLE_WIDTH > birdLeft
          ) {
            if (
              newPos < obstacleHeight + 5 ||
              newPos + BIRD_HEIGHT > obstacleHeight + OBSTACLE_GAP - 5
            ) {
              gameOver();
              return pos;
            }
          }

          return newPos;
        });
        
        setVelocity(v => {
          const newVelocity = Math.min(v + GRAVITY, TERMINAL_VELOCITY);
          return newVelocity;
        });

        frameId = requestAnimationFrame(updatePhysics);
      };

      frameId = requestAnimationFrame(updatePhysics);
    }
    return () => cancelAnimationFrame(frameId);
  }, [started, isGameOver, velocity, obstacleLeft, obstacleHeight]);

  useEffect(() => {
    let obstacleId;
    if (started && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft(left => left - speed);
      }, 24);
      return () => clearInterval(obstacleId);
    } else {
      setObstacleLeft(GAME_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      if (started) {
        const newScore = score + 1;
        setScore(newScore);
        setHighScore(current => Math.max(current, newScore));
        
        if (newScore % SPEED_INCREASE_INTERVAL === 0) {
          setSpeed(currentSpeed => currentSpeed + SPEED_INCREASE);
        }
      }
    }
  }, [started, obstacleLeft]);

  const gameOver = () => {
    setIsGameOver(true);
    setStarted(false);
  };

  const restartGame = () => {
    setIsGameOver(false);
    setBirdPosition(GAME_HEIGHT / 2 - BIRD_HEIGHT / 2);
    setVelocity(0);
    setObstacleHeight(200);
    setObstacleLeft(GAME_WIDTH);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStarted(true);
  };

  return (
    <div className="game-container" onClick={handleAction}>
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <Bird size={20} top={birdPosition} />
      <Pipe 
        top={0}
        height={obstacleHeight}
        left={obstacleLeft}
        isTop={true}
      />
      <Pipe 
        top={obstacleHeight + OBSTACLE_GAP}
        height={GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP}
        left={obstacleLeft}
        isTop={false}
      />
      <div className="score">Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
      
      {isGameOver && (
        <div className="gameOver">
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={handleStartClick}>Start</button>
          <p className="controls-hint">Press ENTER to restart</p>
        </div>
      )}
      
      {!started && !isGameOver && (
        <div className="start-hint">
          Press SPACE or Click to start and jump
        </div>
      )}
      
      {/* Render wind puffs */}
      {puffs.map(puff => (
        <div
          key={puff.id}
          className="wind-puff"
          style={{
            top: puff.top,
            left: puff.left
          }}
        />
      ))}
    </div>
  );
}

export default Game; 