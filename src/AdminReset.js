// Nuovo componente AdminReset.js
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog';

const ADMIN_RESET_PASSWORD = "marsduell2";

const AdminReset = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    if (password === ADMIN_RESET_PASSWORD) {
      setShowPasswordDialog(false);
      setShowConfirmDialog(true);
      setPassword('');
    } else {
      setAlertMessage('Password non corretta!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('tavernaGlobalScores');
    localStorage.removeItem('tavernaGameHistory');
    setShowConfirmDialog(false);
    setAlertMessage('Classifiche resettate con successo!');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      window.location.reload(); // Ricarica la pagina per aggiornare le classifiche
    }, 2000);
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowPasswordDialog(true)}
        className="bg-red-900 text-white px-4 py-2 rounded font-medieval hover:bg-red-800 transition-colors"
      >
        Reset Amministratore
      </button>

      {/* Dialog Password */}
      <AlertDialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <AlertDialogContent className="bg-blue-950 border border-gold-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold-300 font-medieval">
              Accesso Amministratore
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gold-200">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la password..."
                className="w-full bg-blue-900/20 text-gold-200 border border-gold-200/20 rounded p-2 mt-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handlePasswordSubmit();
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowPasswordDialog(false)}
              className="bg-blue-700 text-white hover:bg-blue-600"
            >
              Annulla
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handlePasswordSubmit}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Conferma Reset */}
      <AlertDialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <AlertDialogContent className="bg-blue-950 border border-gold-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold-300 font-medieval">
              Conferma Reset Totale
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gold-200">
              Sei sicuro di voler resettare tutte le classifiche e la storia dei giochi?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowConfirmDialog(false)}
              className="bg-blue-700 text-white hover:bg-blue-600"
            >
              Annulla
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Reset Totale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showAlert && (
        <Alert className="fixed bottom-4 right-4 max-w-sm bg-blue-900/90 border-gold-200/20">
          <AlertTitle className="text-gold-300">Notifica</AlertTitle>
          <AlertDescription className="text-gold-200">
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminReset;