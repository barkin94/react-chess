import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ModalState = {}

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<ModalState["activeModal"]>) => {
			state.activeModal = action.payload;
		},
		closeModal: (state) => {
			delete state.activeModal
		}
	},
});

interface ModalState {
	activeModal?: {
		props?: any;
		componentName: string;
	};
}

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;