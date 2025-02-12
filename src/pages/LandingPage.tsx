import React from "react";
import Logo from "../components/Logo";
import { useNavigate } from "react-router";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="page">
            <div className="page__header">
                <div className="btn-placeholder" />
                <Logo className="page__logo" onClick={() => navigate('/')} />
                <div className="btn-placeholder" />
            </div>
            <h1 className="page__title">Welcome to Help Me</h1>
            <p>Making a difference in someone's life is just a click away.</p>
            <section className="page__content">
                <h2>Bridging Generations, Building Connections</h2>
                <p>
                    In a world where our elderly neighbors often face daily challenges alone,
                    Help Me creates meaningful connections between caring volunteers and seniors in need.
                    We believe that every small act of kindness can transform lives – both for those who
                    receive help and those who give it.
                </p>
                <h2>How It Works</h2>
                <p>Our platform makes it simple to either request assistance or offer your time and skills:</p>
                <h3>For Seniors and Their Families</h3>
                <p>
                    Need help with grocery shopping? Looking for someone to assist with technology?
                    Or maybe just seeking companionship for a afternoon chat? Our verified volunteers are
                    here to help with daily tasks and friendly conversation.
                </p>
                <h3>For Volunteers</h3>
                <p>
                    Turn your free time into meaningful moments. Whether you have an hour to
                    spare or want to make a regular commitment, you can choose tasks that match your
                    schedule and skills. Every helping hand makes a difference.
                </p>
                <h2>Why Help Me?</h2>
                <ul>
                    <li>Safe and Secure: All volunteers undergo thorough background checks</li>
                    <li>Flexible Scheduling: Choose when and how often you want to help</li>
                    <li>Local Connections: Build relationships within your community</li>
                    <li>Real Impact: Make a tangible difference in someone's life</li>
                    <li>Mutual Benefits: Create meaningful connections across generations</li>
                </ul>
                <h2>Join Our Community</h2>
                <p>Whether you're looking to lend a hand or could use some assistance,
                    you're about to become part of something special.
                    Here at Help Me, we're more than just a service – we're a community built on trust, compassion,
                    and the simple belief that we're stronger when we help each other.
                </p>
                <h2>Ready to Get Started?</h2>
                <p>
                    Join thousands of others who are already making a difference. Sign up today and be part of a community that cares.
                </p>
                <blockquote>
                    The best way to find yourself is to lose yourself in the service of others.<br />
                    <i>Mahatma Gandhi</i>
                </blockquote>
            </section>
            <div className="landing_page__actions">
                <button onClick={() => navigate('/sign-in')} >Sign In</button>
                <button onClick={() => navigate('/sign-up')} className="outline">Sign Up</button>
            </div>
        </div>
    );
}

export default LandingPage