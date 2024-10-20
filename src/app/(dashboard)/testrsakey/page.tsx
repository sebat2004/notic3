'use client';

import { useState, useEffect } from 'react';
import { useEncryptKey } from '@/hooks/sussyencypt';

function EncryptionComponent() {
  const [keyToEncrypt, setKeyToEncrypt] = useState('08d22650c2169adedc102b4e604a48e790857dc948308833df053dcbd638691a');
  const [encryptedKey, setEncryptedKey] = useState('');
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    // Access localStorage here
    const storedPublicKey = localStorage.getItem('notic3-pubkey');
    setPublicKey(storedPublicKey);  
  }, []);

  // Call the hook, passing the publicKey state
  const encryptKeyMutation = useEncryptKey(publicKey);

  const handleEncrypt = async () => {   
    try {
      const result = await encryptKeyMutation.mutateAsync(keyToEncrypt);
      setEncryptedKey(result);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={keyToEncrypt}
        onChange={(e) => setKeyToEncrypt(e.target.value)}
        placeholder="Enter key to encrypt"
      />
      <button onClick={handleEncrypt} disabled={encryptKeyMutation.isPending}>
        {encryptKeyMutation.isPending ? 'Encrypting...' : 'Encrypt'}
      </button>
      {encryptedKey && <div>Encrypted Key: {encryptedKey}</div>}
      {encryptKeyMutation.isError && <div>Error: {encryptKeyMutation.error.message}</div>}
    </div>
  );
}

export default EncryptionComponent;