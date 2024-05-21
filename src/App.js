import styled, { ThemeProvider } from "styled-components";
import {darkTheme} from "./utils/Themes";
import {lightTheme} from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/Dialog/ProjectDetails";
import { useState } from "react";
import Experience from "./components/sections/Experience";

const Body = styled.div`
  background-color:${({theme}) => theme.bg};  
  color:${({theme}) => theme.text_primary};
  width:100%;
  height:90vh;
  overflow-x:hidden;
  possition:relative;

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
  `;



function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Navbar />

        <Body>

          <Hero />

          <Wrapper>
            <Skills />
            <Experience />
          </Wrapper>

          <Projects openModal={openModal} setOpenModal={setOpenModal} />

          <Wrapper>
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
