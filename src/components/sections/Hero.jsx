import React from "react"
import styled from "styled-components";
import { Bio } from "../../data/constants";
import Typewriter from "typewriter-effect";
import HeroImg from "../../images/HeroImage.jpg";
import HeroBgAnimation from "../HeroBgAnimation";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
  } from "../../utils/motion";

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 80px 30px;
  z-index: 1;

  @media (max-width: 960px) {
    padding: 66px 16px;
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
  }

  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);
`;

const HeroInnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const HeroLeftContainer = styled.div`
  width: 100%;
  order: 1;
  @media (max-width: 960px) {
    order: 2;
    margin-bottom: 30px;
    display: flex;
    gap: 6px;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroRightContainer = styled.div`
  width: 100%;
  order: 2;
  display: flex;
  justify-content: end;
  @media (max-width: 960px) {
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-contents: center;
    margin-bottom: 80px;
  }

  @media (max-width: 640px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 50px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 8px;
  }
`;

const TextLoop = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  gap: 12px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 22px;
    line-height: 48px;
    margin-bottom: 16px;
  }
`;

const Span = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
`;

const SubTitle = styled.div`
  font-size: 20px;
  line-height: 32px;
  margin-bottom: 42px;
  color: ${({ theme }) => theme.text_primary + 95};

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 16px;
    line-height: 32px;
  }
`;

const ResumeButton = styled.a`
    display: inline-block;
    width: 95%;
    max-width: 300px;
    padding: 16px 0;
    text-align: center;
    border-radius: 50px;
    background-color: ${(props) => props.theme.button || 'blue'};
    background: linear-gradient(225deg, ${(props) => props.theme.button} 0%, ${(props) => props.theme.buttonGradientEnd || props.theme.button} 100%);
    color: ${(props) => props.theme.white || 'white'};
    font-weight: 600;
    font-size: 20px;
    text-decoration: none;
    transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
    box-shadow: 6px 6px 30px ${({ theme }) => theme.sh};, -6px -6px 30px ${({ theme }) => theme.sh};

    &:hover {
        transform: scale(1.05);
        box-shadow: -10px -10px 60px ${({ theme }) => theme.sh};, -15px -15px 60px ${({ theme }) => theme.sh};
    }

    @media (max-width: 640px) {
        padding: 12px 0;
        font-size: 18px;
    }
`;




const Img = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
  border: 2px solid ${({ theme }) => theme.primary};

  @media (max-width: 640px) {
    max-width: 280px;
    max-height: 280px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 1360px;
  overflow: hidden;
  padding: 0 30px;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);

  @media (max-width: 960px) {
    justify-content: center;
    padding: 0 0px;
  }
`;


const Hero = () => {
    return (
        <div id="about">
            <HeroContainer>
        <HeroBg>
          <HeroBgAnimation />
        </HeroBg>

        <motion.div {...headContainerAnimation}>
          <HeroInnerContainer>
            <HeroLeftContainer>
              <motion.div {...headTextAnimation}>
                <Title>
                  Hi, I am <br /> {Bio.name}
                </Title>
                <TextLoop>
                  I am a
                  <Span>
                    <Typewriter
                      options={{
                        strings: Bio.roles,
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </Span>
                </TextLoop>
              </motion.div>

              <motion.div {...headContentAnimation}>
                <SubTitle>{Bio.description}</SubTitle>
              </motion.div>

              <ResumeButton href={Bio.resume} target="_blank">
                Check Resume
              </ResumeButton>
            </HeroLeftContainer>
            <HeroRightContainer>
              <motion.div {...headContentAnimation}>
                <Tilt>
                  <Img src={HeroImg} alt="Mohamed Usama" />
                </Tilt>
              </motion.div>
            </HeroRightContainer>
          </HeroInnerContainer>
        </motion.div>
      </HeroContainer>
        </div>
    );
};

export default Hero