/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  user: {
    Id: null,
    Name: '',
    Surname: '',
    FathersName: '',
    FinCode: '',
    PhoneNumber: '',
    Email: '',
    CreatedDate: null,
    Status: '',
    Profession: '',
    PermissionId: '',
    Permission: '',
    StatusId: null,
    LegalEntityId: null,
    LegalEntity: '',
    IsFounder: null,
    documentType: '',
    documentId: null,
    acceptor: '',
    acceptorVoen: null,
    getLegalEntityDto: {
      Id: null,
      Name: '',
      Voen: '',
      Email: '',
      PhoneNumber: '',
      StatusId: null,
      ActivityField: '',
      Address: ''
    },
    getFile: {
      id: null,
      mimeType: '',
      uploadDate: '',
      size: null,
      name: '',
      fileUrl: '',
      fileNameOnDisk: ''
    },
    PermissionDto: {
      isFounder: false,
      documentCompilation: false,
      canTakePool: false
    }
  },
  entities: [],
  permissions: {
    can: [
      {
        Key: 'add-user',
        Status: true
      },
      {
        Key: 'change-user-status',
        Status: true
      },
      {
        Key: 'edit-user',
        Status: true
      },
      {
        Key: 'change-template-status',
        Status: true
      },
      {
        Key: 'edit-template',
        Status: true
      },
      {
        Key: 'add-template',
        Status: true
      },
      {
        Key: 'delete-template',
        Status: true
      },
      {
        Key: 'delete-user',
        Status: true
      },
      {
        Key: 'add-pool',
        Status: true
      },
      {
        Key: 'delete-user-pool',
        Status: true
      },
      {
        Key: 'proccess-doc',
        Status: true
      },
      {
        Key: 'view-document-types',
        Status: true
      },
      {
        Key: 'view-general-counts',
        Status: true
      },
      {
        Key: 'view-reports-by-status',
        Status: true
      },
      {
        Key: 'view-permission-module',
        Status: true
      },
      {
        Key: 'add-permissions',
        Status: true
      },
      {
        Key: 'change-permission-status',
        Status: true
      },
      {
        Key: 'delete-permission',
        Status: true
      },
      {
        Key: 'edit-permission',
        Status: true
      },
      {
        Key: 'view-user-module',
        Status: true
      },
      {
        Key: 'view-template-module',
        Status: true
      },
      {
        Key: 'view-forwarding-pool-module',
        Status: true
      },
      {
        Key: 'send-contract',
        Status: true
      },
      {
        Key: 'contract-save-as-draft',
        Status: true
      },
      {
        Key: 'send-addition',
        Status: true
      },
      {
        Key: 'addition-save-as-draft',
        Status: true
      },
      {
        Key: 'send-invoice',
        Status: true
      },
      {
        Key: 'invoice-save-as-draft',
        Status: true
      },
      {
        Key: 'send-act',
        Status: true
      },
      {
        Key: 'act-save-as-draft',
        Status: true
      }
    ],
    pages: [
      {
        Key: 'circulation-templates',
        Status: true
      },
      {
        Key: 'create-act',
        Status: true
      },
      {
        Key: 'create-addition',
        Status: true
      },
      {
        Key: 'create-contract',
        Status: true
      },
      {
        Key: 'create-invoice',
        Status: true
      },
      {
        Key: 'document-types',
        Status: true
      },
      {
        Key: 'edc',
        Status: true
      },
      {
        Key: 'books',
        Status: true
      },
      {
        Key: 'entities',
        Status: true
      },
      {
        Key: 'edc-actions',
        Status: true
      },
      {
        Key: 'forwarding-pool',
        Status: true
      },
      {
        Key: 'general-counts',
        Status: true
      },
      {
        Key: 'permissions',
        Status: true
      },
      {
        Key: 'reports',
        Status: true
      },
      {
        Key: 'reports-by-status',
        Status: true
      },
      {
        Key: 'settings',
        Status: true
      },
      {
        Key: 'users',
        Status: true
      }
    ]
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setEntities: (state, action: PayloadAction<any>) => {
      state.entities = action.payload;
    },
    setPermissions: (state, action: PayloadAction<any>) => {
      state.permissions = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser, setEntities, setPermissions } = userSlice.actions;

export default userSlice.reducer;
