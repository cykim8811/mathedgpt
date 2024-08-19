
import { atom } from 'recoil';

const filenameState = atom({
    key: 'filenameState',
    default: '',
});

export { filenameState };
