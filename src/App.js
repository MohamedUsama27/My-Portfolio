import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/Dialog/ProjectDetails";
import { useState, useEffect } from "react";
import Experience from "./components/sections/Experience";
import SplashCursor from './utils/SplashCursor';
import GradualBlur from './utils/GradualBlur';
import Valentine from "./components/sections/Valentine";


const Body = styled.div`
  background: ${({ theme }) => theme.bg};
  background-size: 400% 400%; 
  animation: gradientAnimation 15s ease infinite;
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
`;


const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
  transform: translateY(${(props) => props.scrollY * 0.5}px); /* Scroll effect */
  transition: transform 0.2s ease-out;
`;

const StarsBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh; /* double the height to allow scroll movement */
  z-index: -100; /* stays behind all sections */
  overflow: hidden;
  pointer-events: none;

  background: radial-gradient(ellipse at bottom, #0d1b2a 0%, #000 100%);
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: blink 2s infinite ease-in-out;
  opacity: 0.8;
  transform: translateY(${({ scrollY }) => scrollY * 0.1}px);

  @keyframes blink {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`;

const stars = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  top: Math.random() * 200,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 3 + 2,
}));

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Manage theme state
  const [scrollY, setScrollY] = useState(0);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme); // Toggle between light and dark themes
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Track scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (


    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>


      <BrowserRouter>
        <Navbar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} /> {/* Pass isDarkTheme */}
        <Routes>
          <Route
            path="/"
            element={
              <Body>
                <SplashCursor />
                <Hero />
                <Wrapper scrollY={scrollY}>
                  <Skills />
                  <Experience />
                </Wrapper>
                <Projects openModal={openModal} setOpenModal={setOpenModal} />
                <Wrapper scrollY={scrollY}>
                  <Education />
                  <Contact />
                </Wrapper>
                <Footer />
                {openModal.state && (
                  <ProjectDetails
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />
                )}

                <GradualBlur
                  target="viewport"
                  position="bottom"
                  height="6rem"
                  strength={2}
                  divCount={5}
                  curve="bezier"
                  exponential={true}
                  opacity={1}
                  style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    pointerEvents: "none",
                    zIndex: 100,
                  }}
                />
              </Body>
            }
          />
          <Route path="/valentine" element={<Valentine />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
