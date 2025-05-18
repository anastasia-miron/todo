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
            <h1 className="page__title">Bun venit la Help Me!
            </h1>
            <p>Fă o schimbare în viața cuiva, la doar un clic distanță.</p>
            <section className="page__content">
                <h2>Conectând Oameni, Creând Legături Durabile</h2>
                <p>
                Într-o lume în care mulți dintre noi se confruntă zilnic cu diverse provocări, 
                Help Me creează conexiuni autentice între voluntari dedicați și 
                persoane care au nevoie de sprijin. Credem că fiecare gest de bunătate, 
                oricât de mic, poate schimba vieți – 
                atât pentru cei care primesc ajutor, cât și pentru cei care îl oferă.
                </p>
                <h2>Cum Funcționează platforma</h2>
                <p>Platforma noastră facilitează atât solicitarea de asistență, 
                    cât și oferirea timpului și abilităților dumneavoastră.</p>
                <h3>Pentru Beneficiari</h3>
                <p>
                Aveți nevoie de ajutor la cumpărături, 
                asistență tehnică sau pur și simplu doriți companie pentru o 
                conversație? Voluntarii noștri verificați sunt pregătiți să 
                vă susțină în diverse activități cotidiene și să vă ofere sprijinul necesar.
                </p>
                <h3>Pentru Voluntari</h3>
                <p>
                Transformați timpul liber în momente cu adevărat semnificative. Indiferent dacă aveți o oră disponibilă sau doriți să vă implicați în mod constant, puteți alege sarcini care s
                e potrivesc 
                programului și abilităților dumneavoastră. Fiecare ajutor contează.
                </p>
                <h2>De ce Help Me?</h2>
                <ul>
                    <li>Securitate și Încredere: Toți voluntarii sunt verificați</li>
                    <li>Program Flexibil: Alegeți când și cât de des doriți să ajutați</li>
                    <li>Conexiuni Locale: Construiește relații în comunitatea ta</li>
                    <li>Impact Real: Fă o schimbare reală în viața cuiva</li>
                    <li>Beneficii Reciproce: Creează legături autentice între generații</li>
                </ul>
                <h2>Alăturați-vă Comunității Noastre</h2>
                <p>Indiferent dacă doriți să oferiți ajutor sau aveți nevoie de sprijin, sunteți pe cale să deveniți parte din ceva cu adevărat special. La Help Me, suntem mai mult decât un serviciu – suntem o comunitate bazată pe încredere,
                     compasiune și convingerea că suntem mai puternici atunci 
                     când ne ajutăm unii pe alții
                </p>
                <h2>Gata să Începeți?</h2>
                <p>
                Alăturați-vă miilor de persoane care deja fac o schimbare. Înregistrați-vă astăzi și deveniți parte a unei comunități grijulii.
                </p>
                <blockquote>
                Cea mai bună cale de a te regăsi este să te pierzi în slujba celorlalți.<br />
                    <i>Mahatma Gandhi</i>
                </blockquote>
            </section>
            <div className="landing_page__actions">
                <button onClick={() => navigate('/sign-in')} >Logare</button>
                <button onClick={() => navigate('/sign-up')} className="outline">Înregistrare</button>
            </div>
        </div>
    );
}

export default LandingPage