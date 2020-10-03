import React from 'react';
import { useDispatch } from 'react-redux';
import { Flex, Box } from 'rebass';
import { Link, useLocation } from 'react-router-dom';
import { TiFlowMerge } from 'react-icons/ti';
import { AiOutlineLayout } from 'react-icons/ai';

const items = [
  {
    path: '/flow',
    label: <TiFlowMerge />,
  },
  {
    path: '/layout',
    label: <AiOutlineLayout />,
  },
];

const LinkButton = ({ label, path, active }) => {
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <Box
        py={10}
        textAlign="center"
        bg={active ? 'black' : 'transparent'}
        color={active ? 'white' : 'rgba(255,255,255,0.5)'}
        //sx={{ transition: 'all 200ms ease-in-out' }}
      >
        {label}
      </Box>
    </Link>
  );
};

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      bg="rgba(30,30,30)"
      width={50}
      height="100%"
      m={0}
      sx={{ position: 'fixed', top: 0, left: 0, zIndex: 5000 }}
    >
      <Box
        sx={{
          background:
            'linear-gradient(48deg, rgba(180,58,129,1) 0%, rgba(199,0,0,1) 100%)',
          '& svg': { fill: 'white' },
        }}
      >
        <object
          data="/logo.svg"
          width="50"
          height="50"
          type="image/svg+xml"
        ></object>
      </Box>
      {items.map((item, i) => (
        <LinkButton
          key={`nav-link-${i}`}
          label={item.label}
          path={item.path}
          active={item.path === pathname}
        />
      ))}
    </Flex>
  );
};

export default Nav;
