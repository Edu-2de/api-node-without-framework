import { Redable, Transform, Writable } from "node:stream";

class OneToHundredStream extends Redable {
    index = 1;

    _read() {
        const i = this.index++;

        setTimeout(() => {
            if (i > 100) {
                this.push(null);
            } else {
                const buf = Buffer.from(String(i));
            }
            this.push(buf);
        }, 100);
    }
}

class InverseNumbersStream extends Transform {
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1;
        callback(null, Buffer.from(String(transformed)));
    }
}

class MultiplyByThenStream extends Writable {
    _write(chunk, encoding, callback) {
        console.log(Number(chunk.toString() * 10));
        callback();
    }
}

new OneToHundredStream()
    .pipe(new InverseNumbersStream())
    .pipe(new MultiplyByThenStream());
