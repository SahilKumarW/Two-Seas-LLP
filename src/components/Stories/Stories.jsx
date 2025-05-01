import React from "react";
import "./Stories.css";
import shanza from "../../assets/shanza.png"
import lyla from "../../assets/lyla.png"
import mahnoor from "../../assets/mahnoor.png"

const storiesData = [
    {
        name: "Shanza",
        role: "Sales Consultant",
        description: "Transforming remote customer success for an Australian real estate company",
        image: { shanza },
        link: "#",
    },
    {
        name: "Lyla",
        role: "Business Analyst",
        description: "Expertise in chartered accountancy with a knack for client-centric software solutions",
        image: { lyla },
        link: "#",
    },
    {
        name: "Mahnoor",
        role: "Accounts Assistant",
        description: "Versatile chartered accountant, blending financial acumen with meticulous attention to detail",
        image: { mahnoor },
        link: "#",
    },
];

const Stories = () => {
    return (
        <section className="stories">
            <div className="stories-header">
                <h2>Two Seas LLP stories</h2>
                <a href="#" className="more-link">More →</a>
            </div>
            <div className="stories-grid">
                {storiesData.map((story, index) => (
                    <div className="story-card" key={index}>
                        <div className="story-image">
                            <img src={story.image} alt={story.name} />
                        </div>
                        <div className="story-content">
                            <h3>{story.name}</h3>
                            <p className="role">{story.role}</p>
                            <p className="description">{story.description}</p>
                            <a href={story.link} className="cta--button">
                                {story.name}’s story →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stories;
