import React, { useRef } from "react";
import styled from "styled-components";
import emailjs from "@emailjs/browser";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card_light}; // Adjust background based on theme
  border: 1px solid ${({ theme }) => theme.text_secondary + 50}; // Adjust border based on theme
  padding: 32px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.sh}; // Dynamic box shadow based on theme
  margin-top: 28px;
  gap: 12px;
`;

const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary}; // Text color from theme
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.card_light}; // Input background based on theme
  border: 1px solid ${({ theme }) => theme.text_secondary + 50}; // Border color based on theme
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary}; // Text color from theme
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary}; // Focus border color from theme
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: ${({ theme }) => theme.card_light}; // Adjust based on theme
  border: 1px solid ${({ theme }) => theme.text_secondary + 50}; 
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary}; 
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary}; 
  }
`;

const ContactButton = styled.input`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: ${({ theme }) => theme.primary}; // Button background color from theme
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_button}; // Button text color based on theme
  font-size: 18px;
  font-weight: 600;
`;



const Contact = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_j6u2pp2",
        "template_o96h6rg",
        form.current,
        "_MB7oiPXOqPNG3CeH"
      )
      .then(
        (result) => {
          alert("Message Sent");
          form.current.reset();
        },
        (error) => {
          alert("An error occurred, please try again");
        }
      );
  };

  return (
    <Container id="Contact">
      <Wrapper>
        <Title>Contact</Title>
        <Desc style={{ marginBottom: "40px" }}>
          Feel free to reach out for collaborations and inquiries!
        </Desc>

        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput placeholder="Your Email" name="email_id" required />
          <ContactInput placeholder="Your Name" name="from_name" required />
          <ContactInput placeholder="Subject" name="subject" required />
          <ContactInputMessage
            placeholder="Message"
            name="message"
            rows={4}
            required
          />
          <ContactButton type="submit" value="Send" />
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
