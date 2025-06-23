import React, { useState } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { MenuRounded, DarkMode, LightMode } from "@mui/icons-material";
import { Bio } from "../data/constants";

const Nav = styled.div`
  background: ${({ theme }) => theme.bg}; /* Apply gradient from theme */
  background-size: 400% 400%; /* Expand background to allow for animation */
  animation: gradientAnimation 15s ease infinite; /* Animation loop */
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  height: 90vh;
  overflow-x: hidden;
  position: relative;

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
  width: 80%;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 6px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const GithubButton = styled.a`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.6s ease-in-out;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  height: 100%;
  display: flex;
  align-items: center;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;


const MobileMenu = styled.ul`
  position: absolute;
  top: 80px;
  right: 0;
  width: 100%;
  background: ${({ theme }) => theme.card_light + '99'};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  list-style: none;
  padding: 12px 40px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;

  transition: all 0.4s ease-in-out;

  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  z-index: ${({ isOpen }) => (isOpen ? '1000' : '-1')};

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const ThemeToggleButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.card_light};
  color: ${({ theme }) => theme.text_primary};
  padding: 18px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }

  svg {
    position: absolute;
    transition: opacity 0.4s ease, transform 0.4s ease;
    opacity: 0;
    transform: scale(0.8);
  }

  svg.active {
    opacity: 1;
    transform: scale(1);
  }

  &.mobile {
    display: none;
    @media screen and (max-width: 768px) {
      display: flex;
    }
  }

  &.desktop {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const MobileRightContainer = styled.div`
  display: none;
  align-items: center;
  gap: 12px;

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;



const Navbar = ({ toggleTheme, isDarkTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">Mohamed Usama</NavLogo>

        <MobileRightContainer>
          <ThemeToggleButton className="mobile" onClick={toggleTheme}>
            <LightMode className={isDarkTheme ? "active" : ""} style={{ color: theme.text_primary }} />
            <DarkMode className={!isDarkTheme ? "active" : ""} style={{ color: theme.text_primary }} />
          </ThemeToggleButton>

          <MobileIcon onClick={() => setIsOpen(!isOpen)}>
            <MenuRounded style={{ color: theme.text_primary }} />
          </MobileIcon>
        </MobileRightContainer>

        <NavItems>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
          <NavLink href="#Contact">Contact</NavLink>
        </NavItems>

        <MobileMenu isOpen={isOpen}>
          <NavLink onClick={() => setIsOpen(false)} href="#about">About</NavLink>
          <NavLink onClick={() => setIsOpen(false)} href="#Skills">Skills</NavLink>
          <NavLink onClick={() => setIsOpen(false)} href="#Experience">Experience</NavLink>
          <NavLink onClick={() => setIsOpen(false)} href="#Projects">Projects</NavLink>
          <NavLink onClick={() => setIsOpen(false)} href="#Education">Education</NavLink>
          <NavLink onClick={() => setIsOpen(false)} href="#Contact">Contact</NavLink>
          <GithubButton href={Bio.github} target="_blank">
            Github Profile
          </GithubButton>
        </MobileMenu>

        <ButtonContainer>
          <GithubButton href={Bio.github} target="_Blank">
            Github Profile
          </GithubButton>
          <ThemeToggleButton onClick={toggleTheme}>
            <LightMode className={isDarkTheme ? "active" : ""} style={{ color: theme.text_primary }} /> {/* Updated */}
            <DarkMode className={!isDarkTheme ? "active" : ""} style={{ color: theme.text_primary }} /> {/* Updated */}
          </ThemeToggleButton>
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
