"use client";

import styles from "@/app/styling/ocr-output.module.css";

type Props = {
  previewUrl: string;
  text: string;
  confidence: number;
  onReset?: () => void;
};

export default function OCROutput({ previewUrl, text, confidence, onReset }: Props) {
  const downloadTxt = () => {
    const blob = new Blob([text ?? ""], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ocr_output.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {/* Left: image + Download */}
        <div className={styles.leftCol}>
          <img src={previewUrl} alt="Preview" />
          <button className={styles.leftBtn} onClick={downloadTxt}>
            Download Text
          </button>
        </div>

        {/* Right: text + Upload Another */}
        <div className={styles.rightCol}>
          <div className={styles.textBox}>{text || "(no text recognized)"}</div>
          <div className={styles.conf}>
            Confidence: {Math.round((confidence ?? 0) * 100)}%
          </div>
          {onReset && (
            <button className={styles.rightBtn} onClick={onReset}>
              Upload Another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
