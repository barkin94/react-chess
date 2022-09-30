import { FC, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export const ModalContainer: FC<{ childComponentList: FC<any>[] }> = (props) => {
	useEffect(() => {
		const rootElem = document.getElementById("root")!;
		ReactModal.setAppElement(rootElem);
	}, []);

	const [modalContent, setModalContent] = useState<JSX.Element|null>();
	const activeModal = useSelector((state: RootState) => state.modal.activeModal);

	useEffect(() => {
		if (activeModal) {
			const ModalComponent = props.childComponentList.find((c) => c.name === activeModal.componentName);

			if (!ModalComponent) throw new Error("Component to render inside modal not found.");

			setModalContent(<ModalComponent {...activeModal.props} />);
		} else {
			setModalContent(null);
		}
	}, [activeModal, props.childComponentList]);

	return <ReactModal isOpen={!!modalContent}>{modalContent}</ReactModal>;
};