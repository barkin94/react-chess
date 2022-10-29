import { FC, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useAppSelector } from "../../../redux/store";

const modalNameToComponentMap: Record<string, FC<any>> = {}

export const ModalContainer: FC = () => {
	useEffect(() => {
		const rootElem = document.getElementById("root")!;
		ReactModal.setAppElement(rootElem);
	}, []);

	const [modalContent, setModalContent] = useState<JSX.Element | null>();
	const activeModal = useAppSelector((state) => state.modal.activeModal);

	useEffect(() => {
		if (activeModal) {
			const ModalComponent = modalNameToComponentMap[activeModal.componentName];

			if (!ModalComponent)
				throw new Error("Component to render inside modal not registered: " + activeModal.componentName);

			setModalContent(<ModalComponent {...activeModal.props} />);
		} else {
			setModalContent(null);
		}
	}, [activeModal]);

	return <ReactModal isOpen={!!modalContent}>{modalContent}</ReactModal>;
};

/**
 * Maps names to components, so that the dispatched "openModal" actions resolves correct components.
 * @param config
 */
export const setModalConfig = (config: { name: string; component: FC<any> }[]) => {
	config.forEach(({ name, component }) => (modalNameToComponentMap[name] = component));
};
