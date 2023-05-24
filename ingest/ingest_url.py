# -*- coding: utf-8 -*-

# Importar a biblioteca playwright, o módulo os e o módulo time
from playwright.sync_api import sync_playwright
import os
import time

# Criar uma função para acessar cada link de um site e salvar o código HTML da página
def scrape_site(url):
    # Criar um contexto de navegador e uma página
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()
        # Navegar para a url do site
        page.goto(url)
        # Obter todos os elementos que têm a classe story-title e o atributo data-id
        elements = page.query_selector_all("p.story-title[data-id]")
        # Criar a pasta source_documents se ela não existir
        folder = "../source_documents"
        if not os.path.exists(folder):
            os.makedirs(folder)
        # Para cada elemento, clicar nele e salvar o código HTML da página em um arquivo
        for element in elements:
            # Obter o valor do atributo data-id do elemento
            data_id = element.get_attribute("data-id")
            # Clicar no elemento e esperar que a página seja carregada
            element.click()
            page.wait_for_load_state("networkidle")
            # Adicionar um tempo de espera em segundos
            time.sleep(3)
            # Obter o código HTML da página
            html = page.content()
            # Criar um nome de arquivo baseado no data-id
            filename = "story_" + data_id + ".html"
            # Juntar o caminho da pasta com o nome do arquivo
            filepath = os.path.join(folder, filename)
            # Abrir um arquivo para escrita e salvar o código HTML nele
            with open(filepath, "w") as f:
                f.write(html)
        # Fechar o navegador
        browser.close()

# Chamar a função com a url do site desejado
scrape_site("http://familyverse.bagagemlab.com/read_story.php")