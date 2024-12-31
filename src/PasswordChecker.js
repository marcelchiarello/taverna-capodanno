import React, { useState } from 'react';

const PasswordChecker = () => {
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const SECRET_LOCATION = "caffe cappuccini";
  const SECRET_PASSWORD = "Excalibur2025";
  
  const checkLocation = (input) => {
    // Pulisce l'input da spazi extra, accenti e rende tutto minuscolo
    const cleanInput = input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const cleanSecret = SECRET_LOCATION
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleanInput === cleanSecret;
  };

  const handleInputChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    setShowPassword(checkLocation(newLocation));
  };

  return (
    <div className="bg-blue-900/20 p-6 rounded-lg mt-8">
      <h4 className="text-xl text-party-100 mb-4 font-medieval border-b border-gold-200/20 pb-2">
        Generatore della parola d'ordine per ottenere l'amuleto sacro
      </h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gold-200 mb-2">
            Inserisci la soluzione dell enigma:
          </label>
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            className="w-full bg-blue-950/50 text-gold-200 border border-gold-200/20 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
            placeholder="Inserisci il luogo qui..."
          />
        </div>

        {showPassword && (
          <div className="animate-fadeIn">
            <p className="text-gold-200 mb-2">La parola d'ordine è:</p>
            <p className="text-party-100 text-xl font-medieval bg-blue-900/30 p-4 rounded-lg border border-gold-200/20 text-center">
              "{SECRET_PASSWORD}"
            </p>
            <p className="text-gold-200/80 mt-4 text-sm italic">
              Pronunciala al guardiano per ottenere l'amuleto sacro
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordChecker;
