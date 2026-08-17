// Google Drive integration for review image uploads

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id?: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export async function uploadImageToGoogleDrive(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Load Google GIS script if not present
    if (!window.google?.accounts?.oauth2) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => requestTokenAndUpload(file, resolve, reject);
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    } else {
      requestTokenAndUpload(file, resolve, reject);
    }
  });
}

function requestTokenAndUpload(
  file: File,
  resolve: (url: string) => void,
  reject: (err: Error) => void
) {
  try {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: '684750266151-bmii6b3tmfh2gmfillrbqj1ils94bvi5.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: async (response) => {
        if (response.error !== undefined) {
          reject(new Error(response.error));
          return;
        }
        const accessToken = response.access_token;
        if (!accessToken) {
          reject(new Error('No access token returned from Google'));
          return;
        }

        try {
          const driveFileUrl = await uploadFileToDriveAPI(file, accessToken);
          resolve(driveFileUrl);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      },
    });

    client.requestAccessToken({ prompt: 'consent' });
  } catch (err) {
    reject(err instanceof Error ? err : new Error(String(err)));
  }
}

async function uploadFileToDriveAPI(file: File, accessToken: string): Promise<string> {
  const metadata = {
    name: `seedhaven_review_${Date.now()}_${file.name}`,
    mimeType: file.type || 'image/jpeg',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive upload failed: ${errText}`);
  }

  const data = await res.json();
  const fileId = data.id;

  // Make the file publicly readable so it can be viewed in reviews
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: 'reader',
      type: 'anyone',
    }),
  });

  // Get file details for webViewLink
  const getRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink,webContentLink,thumbnailLink`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (getRes.ok) {
    const fileData = await getRes.json();
    return fileData.webViewLink || fileData.webContentLink || `https://drive.google.com/file/d/${fileId}/view`;
  }

  return `https://drive.google.com/file/d/${fileId}/view`;
}
