import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const blocks = ['Flex', 'Box'];

const styles = {
  nav: {
    position: 'fixed',
    top: 140,
    left: 0,
    margin: 0,
    width: 50,
    zIndex: 500000,
  },
  navButton: {
    background: 'transparent',
    backgroundColor: 'rgba(0,0,0,0)',
    border: 'none',
    color: 'rgba(255,255,255,0.65)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    width: '100%',
    padding: '10px 0',
    cursor: 'pointer',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

const Nav = () => {
  const dispatch = useDispatch();
  const selectedBlocks = useSelector((state) => state.env.selectedBlocks);

  const handleCreate = (name) => () => {
    dispatch.layout.addBlock({
      name,
      parent: selectedBlocks[selectedBlocks.length - 1],
    });
  };

  return (
    <div style={styles.nav}>
      {blocks.map((b, i) => (
        <button
          key={'navButton' + i}
          style={styles.navButton}
          onClick={handleCreate(b)}
          variant="outline"
        >
          {b.slice(0, 4)}
        </button>
      ))}
    </div>
  );
};

export default Nav;
