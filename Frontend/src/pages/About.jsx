import React, { useState } from 'react';
import MusicPlayer from '../components/MusicPlayer';

export default function About() {
  const [isEnglish, setIsEnglish] = useState(false);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <div className='pt-40 mx-auto justify-start max-w-[1360px]'>
      <button onClick={toggleLanguage} className='bg-black text-white p-2 rounded-md hover:bg-gray-700  mb-4 '>
        {isEnglish ? 'Cambiar a Español' : 'Switch to English'}
      </button>
      <article className='mx-auto '>
        {isEnglish ? (
          <div className='p-5'>
            <h1 className='text-[40px] font-bold'>Me:</h1>
            <section>

              Hello! My name is <span>Daniel</span>, I am 26 years old and I specialize in web development. <br /> With a passion for technology and innovation, I specialize in creating dynamic and efficient web applications using React, one of the most popular JavaScript libraries.

              Each project is an opportunity to combine functional design with an intuitive user experience, ensuring technological solutions that not only meet but exceed expectations. <br /> I am committed to continuous learning and adopting best practices in web development to ensure high-quality, high-performance products. <br />

              Here you can find some highlighted features of the applications I develop: <br /><br />
            </section>
            <div className='flex'>
              <section>
                Dynamic User Interface: Applications that respond fluidly to user interactions. <br /><br />
                Modular and Reusable Code: Clean code structure and reusable components for easy maintenance and scalability. <br /><br />
                Performance Optimization: Implementation of optimization techniques to ensure fast load times and efficient execution. <br /><br />
                Responsive Design: Consistent and attractive experience on any device, be it mobile, tablet, or desktop. <br /><br />
                API Integration: Connecting and consuming external services to enrich the application's functionality. <br /><br />
                If you're looking for a modern, efficient, and visually appealing website or application, you're in the right place. Let's talk and make your digital project a reality!
              </section>
              <section>
                <img src="/me.webp" alt="" />
              </section>
            </div>
          </div>
        ) : (
          <div className='p-5'>
            <h1 className='text-[40px] font-bold' >Yo:</h1>
            <section>
              ¡Hola! Mi nombre es <span>Daniel</span>, tengo 26 años y me dedico al desarrollo de páginas web. <br /> Con una pasión por la tecnología y la innovación, me especializo en crear aplicaciones web dinámicas y eficientes utilizando React, una de las bibliotecas más populares de JavaScript.

              Cada proyecto es una oportunidad para combinar diseño funcional con una experiencia de usuario intuitiva, garantizando soluciones tecnológicas que no solo cumplen con las expectativas, sino que las superan. <br /> Estoy comprometido con el aprendizaje continuo y la adopción de las mejores prácticas en el desarrollo web para asegurar productos de alta calidad y rendimiento. <br />

              Aquí puedes encontrar algunas características destacadas de las aplicaciones que desarrollo: <br /><br />
            </section>
            <div className='flex'>
              <section>
                Interfaz de Usuario Dinámica: Aplicaciones que responden fluidamente a las interacciones del usuario. <br /><br />
                Código Modular y Reutilizable: Estructura de código limpia y componentes reutilizables para facilitar el mantenimiento y escalabilidad. <br /><br />
                Optimización del Rendimiento: Implementación de técnicas de optimización para garantizar una carga rápida y una ejecución eficiente. <br /><br />
                Diseño Responsivo: Experiencia consistente y atractiva en cualquier dispositivo, ya sea móvil, tableta o escritorio. <br /><br />
                Integración con APIs: Conexión y consumo de servicios externos para enriquecer la funcionalidad de la aplicación. <br /><br />
                Si buscas una página web o una aplicación moderna, eficiente y visualmente atractiva, estás en el lugar correcto. ¡Hablemos y hagamos realidad tu proyecto digital!
              </section>
              <section>
                <img className='' src="/me.webp" alt="" />
              </section>
            </div>
          </div>
        )}
      </article>
      <MusicPlayer/>
    </div>
  );
}
