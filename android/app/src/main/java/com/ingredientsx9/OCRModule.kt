package com.ingredientsx9

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.util.Base64;
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@ReactModule(name = "OCRModuleAndroid")
class OCRModuleAndroid(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val processor = OCRProcessor()

    override fun getName() = "OCRModuleAndroid"

    @ReactMethod
    fun recognizeText(base64Image: String, promise: Promise) {
        processor.extractOCRObservations(base64Image)
            .thenAccept { observations ->
                val result = Arguments.createArray()
                observations.forEach { obs ->
                    val map = Arguments.createMap().apply {
                        putString("text", obs.text)
                        putArray("bounds", Arguments.createArray().apply {
                            addDouble(obs.bounds.x.toDouble())
                            addDouble(obs.bounds.y.toDouble())
                            addDouble(obs.bounds.width.toDouble())
                            addDouble(obs.bounds.height.toDouble())
                        })
                    }
                    result.pushMap(map)
                }
                promise.resolve(result)
            }
            .exceptionally { e ->
                promise.reject("OCR_ERROR", e)
                null
            }
    }
}

class OCRBounds {
    public final float x, y, width, height;
    public OCRBounds(float x, float y, float width, float height) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
}

class OCRObservation {
    public final String text;
    public final OCRBounds bounds;
    public OCRObservation(String text, OCRBounds bounds) {
        this.text = text; this.bounds = bounds;
    }
}

class OCRProcessor {

    public CompletableFuture<List<OCRObservation>> extractOCRObservations(String base64Image) {
        CompletableFuture<List<OCRObservation>> future = new CompletableFuture<>();
        byte[] decodedBytes = Base64.decode(base64Image, Base64.DEFAULT);
        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        InputImage image = InputImage.fromBitmap(bitmap, 0);
        int imageWidth = bitmap.getWidth();
        int imageHeight = bitmap.getHeight();

        TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            .process(image)
            .addOnSuccessListener(textResult -> {
                List<OCRObservation> observations = new ArrayList<>();
                for (Text.TextBlock block : textResult.getTextBlocks()) {
                    for (Text.Line line : block.getLines()) {
                        for (Text.Element element : line.getElements()) {
                            Rect rect = element.getBoundingBox();
                            if (rect != null) {
                                float x = rect.left / (float) imageWidth;
                                float y = rect.top / (float) imageHeight;
                                float width = rect.width() / (float) imageWidth;
                                float height = rect.height() / (float) imageHeight;
                                OCRBounds bounds = new OCRBounds(x, y, width, height);
                                observations.add(new OCRObservation(element.getText(), bounds));
                            }
                        }
                    }
                }
                future.complete(observations);
            })
            .addOnFailureListener(future::completeExceptionally);

        return future;
    }
}
