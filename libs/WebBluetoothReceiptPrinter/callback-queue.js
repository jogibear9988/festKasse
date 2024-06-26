class CallbackQueue {
    constructor() {
        this._queue = [];
        this._working = false;
    }

    add(data) {
        let that = this;

        async function run() {
            if (!that._queue.length) {
                that._working = false;
                return;
            }

            that._working = true;

            let callback = that._queue.shift();
            try {
                await callback();
            } catch (err) {
                console.error(err);
            }

            run();
        }

        this._queue.push(data);

        if (!this._working) {
            run();
        }
    }
}

export default CallbackQueue;