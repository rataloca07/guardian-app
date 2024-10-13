/*package com.unmsm.guardianapp;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}*/
package com.unmsm.guardianapp;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FirebaseApp.initializeApp(this);  // Inicializar Firebase
    }
}
