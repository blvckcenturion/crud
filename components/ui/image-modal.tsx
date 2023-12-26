'use client'
import Image from "next/image";
import { FC, MouseEventHandler } from 'react';

interface ImageModalProps {
  src: string;
  onClose: MouseEventHandler;
}

export const ImageModal: FC<ImageModalProps> = ({ src, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <Image src={src} alt="Expanded Product" width={500} height={500} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
);