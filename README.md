# reach-router + typescript + react-hook + webpack-chain + react-keepalive + lerna

## Started

### link package

```bash
cd ./package/build
yarn link
cd ../../
yarn link '@act2do/build'
```

```bash
cd ./package/component
yarn link
cd ../../
yarn link '@act2do/component'
```

### Install some node package

```bash
yarn install

yarn global add lerna
yarn global add @commitlint/cli @commitlint/config-conventional
```

### Lerna run

```bash
lerna bootstrap
```

## Application

| name              | nick name | description    |
|-------------------|-----------|----------------|
| example           | EX        | 例子           |

## Development

```bash
yarn run dev:{application.nickname}

ex: yarn run dev:EX
```

### ex

```bash
yarn run dev:EX
```
