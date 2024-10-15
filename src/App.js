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
import { useState, useEffect } from "react";
import Experience from "./components/sections/Experience";


const Body = styled.div`
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
            <ProjectDetails
              openModal={openModal}
              setOpenModal={setOpenModal}
            />
          )}
        </Body>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
