// TypeScript file
interface IUUContainer {
    /**
     * 父容器
     */
    container: any;

    /**
     * 释放
     */
    dispose (): void;

    /**
     * 呈现
     */
    draw (container: any): void;
}