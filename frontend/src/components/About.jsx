import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom"; 
import JustinImage from '../assets/JustinImage.jpg';

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
        image: 'link-to-member-2-image',
        description: 'Description for Member 4',
        github: 'https://github.com/member4',
        linkedin: 'https://www.linkedin.com/in/member4',
        email: 'dmytro@example.com'
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
        github: 'https://github.com/jchau-623',
        linkedin: 'https://www.linkedin.com/in/justin-chau-1123a9142/',
        email: 'jchau623@gmail.com'
    }
];

export default function About() {
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
    const currentMember = members[currentMemberIndex];

    const handleGmailClick = (email, name) => {
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Hello%20${name}&body=Hi%20${name},`;
        window.open(gmailLink, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-secondary p-8">
            <Link to="/home" className="absolute top-4 left-4 text-white text-4xl p-2">
                <FaArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold mb-8 text-white">Meet the Team</h1>
            <div className="flex flex-col md:flex-row items-center mb-8 w-full max-w-6xl">
                <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-8">
                    <img src={currentMember.image} alt={currentMember.name} className="w-[300px] h-[400px] object-cover rounded-lg mb-4" />
                    <h2 className="text-2xl font-bold text-white">{currentMember.name}</h2>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-lg text-center md:text-left max-w-2xl text-white mb-4">
                        {currentMember.description}
                    </p>
                    <div className="flex flex-col items-center md:items-start mb-4">
                        <div className="flex items-center mb-2">
                            <FaGithub className="mr-2 text-2xl text-[#171515]" />
                            <Link
                                to={{ pathname: currentMember.github }}  // Use Link instead of a tag
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl text-white hover:text-secondary transition-all duration-200"
                            >
                                GitHub
                            </Link>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaLinkedin className="mr-2 text-2xl text-[#0077B5]" />
                            <Link
                                to={{ pathname: currentMember.linkedin }}  // Use Link instead of a tag
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl text-white hover:text-secondary transition-all duration-200"
                            >
                                LinkedIn
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-2xl text-[#D44638]" />
                            <button
                                onClick={() => handleGmailClick(currentMember.email, currentMember.name)}
                                className="text-xl text-white hover:text-secondary transition-all duration-200"
                            >
                                Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-12 space-x-4">
                {members.map((member, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentMemberIndex(index)}
                        className={`px-6 py-3 text-lg rounded transition-all duration-200 ${currentMemberIndex === index
                            ? "bg-blue-700 text-white"
                            : "bg-secondary text-white hover:bg-blue-700"
                            }`}
                    >
                        {member.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
