import React from 'react';
import '../styles/Home.scss';
import FloatingUser from '../components/FloatingUser';
import HeroContent from '../components/HeroContent';
import PlaylistContainer from '../components/PlaylistContainer';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <FloatingUser/>
                <div className="inner">
                    <HeroContent/>
                </div>
            </section>
            <main>
                <div className="inner">
                    <PlaylistContainer/>
                </div>
            </main>
        </div>
    );
}

export default Home;