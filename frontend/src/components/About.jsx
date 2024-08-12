import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import JustinImage from "../assets/JustinImage.jpg";
import LeslieImg from "../assets/LeslieImg.jpg";
import homeImg from "../assets/home.gif";
import { Link } from "react-router-dom";
import NoUser from "./NoUser";
import { useSelector } from "react-redux";
import DmytroImage from '../assets/DmytroImage.jpeg'

const members = [
    {
        name: 'Anthony G',
        image: 'link-to-member-1-image',
        description: 'Description for Member 2',
        github: 'https://github.com/member2',
        linkedin: 'https://www.linkedin.com/in/member2',
        email: 'anthony@example.com'
    },
    {
        name: 'Dmytro',
        image: DmytroImage,
        description: "I am a driven and goal oriented professional. I recently finished the full stack web development program at App Academy, and my passion is to help build innovative and practical technologies. Proficient in Express, Sequelize, JavaScript, React/Redux, Flask, Python, SQLAlchemy, HTML, and CSS.I'm a highly motivated software developer who is driven to excel at anything that I put my mind to. In my free time I enjoy going on adventures and getting out into nature and playing soccer and guitar. Please feel free to check out my portfolio, LinkedIn, and Github for more information!",
        github: 'https://github.com/Dmytro-Yakovenko',
        linkedin: 'https://www.linkedin.com/in/dmytro-yakovenko-5b2022230/',
        email: 'd.yakovenko1986@gmail.com'
    },
    {
        name: 'Leslie C',
        image: 'link-to-member-3-image',
        description: 'Description for Member 3',
        github: 'https://github.com/member3',
        linkedin: 'https://www.linkedin.com/in/member3',
        email: 'leslie@example.com'
    },
    {
        name: 'Justin C',
        image: JustinImage,
        description: `I am Justin, a first-generation Asian American from Queens, NY.
                  Witnessing firsthand the struggles my parents went through assimilating into this country,
                  I created this translator app to help immigrants and non-English speakers who face language barriers when they first arrive in the U.S.
                  My goal is to make communication easier for everyone, no matter their background.
                  Thanks for visiting, and I hope this app helps you or someone you know!`,
    github: "https://github.com/jchau-623",
    linkedin: "https://www.linkedin.com/in/justin-chau-1123a9142/",
    email: "jchau623@gmail.com",
  },
];

export default function About() {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const currentMember = members[currentMemberIndex];
  const { user } = useSelector((state) => state.users);

  const handleGmailClick = (email, name) => {
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Hello%20${name}&body=Hi%20${name},`;
    window.open(gmailLink, "_blank");
  };

  if (!user) {
    return <NoUser />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-secondary p-8">
        {/* <a href="/home" className="absolute top-4 left-4 text-white text-4xl p-2">
                <FaArrowLeft />
            </a> */}
        <h1 className="text-4xl font-bold mb-20 text-white">Meet the Team</h1>
        <div className="flex flex-col md:flex-row md:justify-around items-center mb-8 w-full max-w-6xl">
          <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-8">
            <img
              src={currentMember.image}
              alt={currentMember.name}
              className="w-[300px] h-[400px] object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-white">
              {currentMember.name}
            </h2>
          </div>
          <div className="flex flex-col gap-6 justify- md:items-start">
            <p className="text-xl text-center md:text-left max-w-2xl text-white mb-4">
              {currentMember.description}
            </p>
            <div className="w-full flex flex-col justify-center items-center md:items-start mb-4">
              <div className="flex items-center mb-2">
                <FaGithub className="mr-2 text-2xl text-[#171515]" />{" "}
                {/* GitHub logo color */}
                <a
                  href={currentMember.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-white hover:text-secondary transition-all duration-200"
                >
                  GitHub
                </a>
              </div>
              <div className="flex items-center mb-2">
                <FaLinkedin className="mr-2 text-2xl text-[#0077B5]" />{" "}
                {/* LinkedIn logo color */}
                <a
                  href={currentMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-white hover:text-secondary transition-all duration-200"
                >
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-2xl text-[#D44638]" />{" "}
                {/* Envelope logo color */}
                <button
                  onClick={() =>
                    handleGmailClick(currentMember.email, currentMember.name)
                  }
                  className="text-xl text-white hover:text-secondary transition-all duration-200"
                >
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12 space-x-4">
          {" "}
          {/* Increased margin-top to push the buttons lower */}
          {members.map((member, index) => (
            <button
              key={index}
              onClick={() => setCurrentMemberIndex(index)}
              className={`px-6 py-3 text-lg rounded transition-all duration-200 ${
                currentMemberIndex === index
                  ? "bg-blue-700 text-white"
                  : "bg-secondary text-white hover:bg-blue-700"
              }`}
            >
              {member.name}
            </button>
          ))}
        </div>
        <div className="absolute flex justify-center bottom-0 w-full bg-secondary text-white py-4 h-[80px]">
          <Link
            to="/home"
            className="flex items-center gap-3 hover:bg-primary hover:scale-90 transition-all duration-200 px-4 py-2 rounded-lg"
          >
            <img
              src={homeImg}
              alt="home page icon"
              className="w[50px] h-[50px]"
            />
            <p>Return Home</p>
          </Link>
        </div>
      </div>
    </>
  );
}
