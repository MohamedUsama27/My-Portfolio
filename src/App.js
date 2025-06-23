import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/Dialog/ProjectDetails";
import Experience from "./components/sections/Experience";
import { useState, useEffect } from "react";

// 🌌 Starry Background Wrapper
const StarsBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh;
  z-index: -100;
  pointer-events: none;
  background: radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%);
`;

const Star = styled.div`
  position: absolute;
  border-radius: 50%;
  background: white;
  opacity: 0.8;
  animation: blink infinite ease-in-out;
  transform: translateY(${({ scrollY }) => scrollY * 0.1}px);

  @keyframes blink {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`;

// 🌈 Main Page Background + Theme Animated
const Body = styled.div`
  background: ${({ theme }) => theme.bg};
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  min-height: 100vh;
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

// 💫 Foreground Wrapper With Parallax Effect
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
  transform: translateY(${(props) => props.scrollY * 0.5}px);
  transition: transform 0.2s ease-out;
`;

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // 🛰 Track scroll for parallax and background
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🌟 Generate 150 Random Stars Once
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    top: Math.random() * 200,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <BrowserRouter>
        {/* 🌌 Background Stars */}
        <StarsBackground>
          {stars.map((star) => (
            <Star
              key={star.id}
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${star.duration}s`,
              }}
              scrollY={scrollY}
            />
          ))}
        </StarsBackground>

        {/* 🌐 Main Content */}
        <Navbar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <Body>
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
            <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
          )}
        </Body>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;